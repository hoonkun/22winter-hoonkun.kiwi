---
author: GoHoon
title: 웹에 마인크래프트의 지도를 띄워보자!
date: 2023-04-01, 15:42
categories: [dev, dev-others]
---
> 마인크래프트 서버는 바닐라/Paper/Spigot 등의 여러 종류가 있는데, 이번 글에서는 Spigot을 사용해 구현했음을 알린다.   
> 아래에 적혀있는 코드들은 글에 적기 쉽도록 수정하거나 의사코드를 Kotlin 코드로 수동으로 작성한 것이므로 컴파일 에러가 나거나, 일부가 빠져있을 수도 있다.   
> 따라서 전체 코드를 구경하고싶다면 [여기(GitHub)](https://github.com/hoonkun/spoon.minecraft-nested-server)에서 확인하시길 바란다...

웹 페이지에 현재 열려있는 마인크래프트 서버의 특정 위치 지도를 띄워보자!
<!-- Excerpt -->

## 서론
마인크래프트 서버 플러그인 kotlin 으로 구현되는데, 그 플러그인에서 별도로 다른 종류의 서버를 열 수 있게 되어있다. 이를테면 웹서버라던지.

그래서 플러그인 내에서 열린 웹서버가 마인크래프트 서버의 데이터를 읽어 프론트에 던져주는 것이 가능하다는 말이다.

그리하여, 마인크래프트 월드의 지도를 프론트 웹에 그려보고싶다는 생각이 들어 그것을 구현해봤다. 아래의 모든 코드는 마인크래프트 서버 플러그인 코드이며, 
ktor 를 사용한 서버 구현과 관련한 내용은 주제에서 벗어난다고 판단해 포함하지 않았다.

## 표면 블럭의 데이터 가져오기

### World.getHighestBlockAt(Int, Int)

World 에는 getHighestBlockYAt(int, int) 와 getHighestBlockAt(int, int) 가 있다.

각각 지정한 block x, block z 에 대해 가장 높은 위치에 있는 non-air(혹은 3번째 인수인 Heightmap에 해당하는) 블럭의 y좌표나 블럭 자체를 가져올 수 있다.

지도를 그리려면 지정된 좌표의 가장 위쪽에 있는 블럭의 데이터를 알아야한다. 그래서 처음에는 위의 두 함수를 사용했었다.

위의 두 함수가 가져가는 block x 및 block z 는 월드 글로벌 좌표로, 우리가 흔히 F3을 누르고 확인하는 그 좌표이며 가장 간단하게 작성할 수 있다.

```kotlin
fun surface(world: World, from: Pair<Int, Int>, to: Pair<Int, Int>) {
    val xRange = from.first to to.first
    val zRange = from.second to to.second
    
    (xRange to zRange).forEach { x, z ->
        val block = world.getHighestBlockAt(x, z)
        println(block.type.key.key)
    }
}
fun Pair<IntRange, IntRange>.forEach(block: (Int, Int) -> Unit) {
    for (x in first) for (z in second) block(x, z)
}
```
> World 를 사용하여 표면의 블럭을 가져오는 코드 (느리다)

위의 코드가 월드 좌표 기준 from(x1 to z1) 에서 to(x2 to z2) 까지의 모든 가장 위쪽에 있는 블럭의 이름을 출력하는 코드이다.

근데, 돌려보면 알겠지만 **느리다**. 굉장히 느리다. 5x5 청크 크기의 지형을 로드하는데 5초 이상이 걸렸다.

마인크래프트 서버가 5초동안 멈춘다? 용납할 수 없다. 이건 안된다.

### ChunkSnapshot.getHighestBlockYAt(Int, Int)

그리하여 방법을 찾던 중, ChunkSnapshot 이라는 것의 존재를 알아냈다.

JavaDoc을 보면, Thread-safe 하게 현재 청크의 immutable 한 상태를 저장하는 친구였다.

이 친구는 '로드된 청크'에 대해서는 빠르게 동작하고, 플레이어가 있는 청크 및 그 주변 청크는 무조건 로드된 상태가 되기 때문에 적어도 플레이어가 있는 곳의 지도는 빠르게 불러올 수 있었다.

다만, 이 친구는 블럭을 바로 가져오지는 않고 함수가 가져가는 두 int가 청크에 상대적인 좌표(그러니까, 0-15 중 하나)이기 떄문에 조금 수정이 필요했다.

```kotlin
fun surface(world: World, from: Pair<Int, Int>, to: Pair<Int, Int>) {
    val xRange = from.first until to.first
    val zRange = from.second until to.second
    
    val chunks = mutableMapOf<Pair<Int, Int>, ChunkSnapshot>()
    
    (xRange to zRange).forEach { x, z ->
        // 글로벌 좌표를 청크 좌표로 변환
        val chunkX = floor(x.toFloat() / 16).toInt()
        val chunkZ = floor(z.toFloat() / 16).toInt()

        // 글로벌 좌표를 청크 상대 좌표로 변한
        val blockX = (x % 16).let { if (it < 0) 16 + it else it }
        val blockZ = (z % 16).let { if (it < 0) 16 + it else it }

        // 한 번의 오퍼레이션 안에서 이미 가져온 적 있는 snapshot은 다시 가져오지 않도록 함
        val chunk = chunks.getOrPut(chunkX to chunkZ) { world.getChunkAt(chunkX, chunkZ).chunkSnapshot }
        
        val blockY = chunk.getHighestBlockYAt(blockX, blockZ)
        val block = chunk.getBlockType(blockX, blockY, blockZ)
        
        println(block.key.key)
    }
}
```
> ChunkSnapshot 을 사용하여 표면의 블럭을 가져오는 코드 (빠르다!)

빠르다! 이렇게 하니 로드된 청크에 대해서는 0.2초 남짓으로 줄었다!

로드되지 않은 청크는 조금 덜 빠르지만, 이전에 World에서 가져올때보다는 빠르다.

## 데이터 압축하기

이 데이터는 압축을 반드시 해야한다. 5x5 청크 크기의 지형 정보를 담는 배열은 그 길이가 6400개이고, 거기에 각각 색상코드를 넣으면 따옴표와 쉼표를 포함하여 10이 곱해진다.

압축 방식은 실제 마인크래프트에서의 압축 방식을 참고했다. 

1. 우선 해당 지형에 포함되는 모든 색상 데이터를 집합화한다. (이걸 마인크래프트에서는 팔레트(palette)라고 한다)
2. 실제 색상 데이터 배열의 내용을, 색상 데이터 대신 1에서 만든 팔레트에서의 인덱스로 변경한다.
3. 2에서 만든 인덱스 배열을 압축한다:
   1. Palette 의 길이를 표현할 수 있는 가장 작은 비트수를 구한다
   2. 32비트 Int의 안에 2의 인덱스를 우겨넣는다(예를들어 3-1에서 구한 비트 수가 5라면, 하나의 Int에 6개의 인덱스를 우겨넣을 수 있다)

실제 마인크래프트에서는 Long을 사용하여 64비트 안에 우겨넣고 있는데, 웹에서 표시하려면 자바스크립트를 써야하지만 어째선지 64비트로 하면 다시 읽을 때 문제가 생겨서 32비트로 줄였다.

대략 이런 느낌이다:

```kotlin
val palette = colors.toSet()
val indexes = colors.map { palette.indexOf(it) }

val compressed = mutableListOf<Int>()
val bitsPerBlock = palette.size.let {
    var result = 4
    while (it > pow(2, result)) result++
    result
}

var bits: Int = 0
var bitIndex: Int = 0
var hasMoreSpaces = false

indexes.forEach {
    bits = bits shl bitsPerBlock
    bits = bits or it
    
    bitIndex += bitsPerBlock
    hasMoreSpaces = bitIndex + bitsPerBlock <= Int.SIZE_BITS
    
    if (!hasMoreSpaces) {
        compressed.add(bits)
        bits = 0
        bitIndex = 0
    }
}

if (hasMoreSpaces) compressed.add(bits)
```
> 6400 개의 인덱스 Int 배열을 더 적은 길이의 Int 배열로 압축하는 코드

&nbsp;  
## 블럭의 색상 가져오기

우선 나는 블럭의 namespace key 중 key 부분을 가지고 색상을 바로 가져오고싶다. 

그러므로 key는 namespace key(예를 들면, oak_planks 라던지), value는 색상 hex 코드인 Map<String, String>을 만들 것이다. 

### 텍스쳐 파일 목록 가공

근데 생각보다 해야할 게 많다.

먼저 지도에 그릴 블럭들은 한정되어있다. 유리판이라던가, 배리어같은 블럭들은 그리지 않을 것이므로.<sup>1</sup>

게다가 나뭇잎과 물, 잔디블럭은 왜인지 전부 회색이다(아마 바이옴 및 온도에 따라 색상이 결정되므로 블렌딩이 가능하게 하기 위한 것 같다).<sup>2</sup>

더해서, 예를 들어 통나무(log)의 경우 면별로 텍스쳐가 달라 실제 key 인 (oak_log) 에 정확히 일치하는 텍스쳐는 없다(oak_log_top.png 같은 식).<sup>3</sup>

나는 버전이 업데이트될 때마다 필요한 파일만 선택해서 따로 분리해줄 자신이 없으므로(파일이 이제 곧 1000개가 넘을텐데 말이지), 스크립트로 해결하기로 한다.

#### 블럭 필터링

우선 그릴 블럭들의 목록을 만들자. 이것은 Material 클래스를 통해 매우 쉽게 수행할 수 있다.

단단한 블럭이고, 빛을 투과시키지 않으며 air 가 아닌 블럭을 선택한다.
단, 이렇게 할 경우 반블럭, 계단, 물, 용암, 나뭇잎, 잔디경로(grass_path 라고 불리는 것)이 제외되므로 따로 포함하도록 한다.

```kotlin
val validationExceptions = mapOf(
  "exact-match" to listOf("WATER", "LAVA", "DIRT_PATH"),
  "contains" to listOf("SLAB", "STAIRS", "LEAVES")
)
val isValidationExceptional: Material.() -> Boolean = { material -> 
    validationExceptions["contains"]!!.any { material.name.contains(it) } || validationExceptions["exact-match"]!!.any { material.name == it }
}
val targets = Material.values()
    .filter { (it.isBlock && it.isSolid && it.isOccluding && !it.isAir) || it.isValidationExceptional() }
    .filter { !it.name.contains("LEGACY") }
    .sortedBy { it.name }
    .toMutableList()
```
> 유효하게, 지도에 그릴 수 있는 블럭들을 목록화하는 코드

#### 색상 예외

일부 블럭은 텍스쳐로부터 색상을 추출할 수 없다. 따라서 그것들은 따로 명시해주도록 하자. 

아래 `Map`의 `key` 는 `Material.name.lowercase()` 에 해당한다.

```kotlin
val colorExceptions = mapOf(
    "water" to "3D6F8D",
    "grass_block" to "3F6530",
    "dirt_path" to "8E7340"
)
```
> 일부 예외 처리 (2)

#### 텍스쳐 이름 매핑

위에서 언급한대로, 블럭의 이름과 텍스쳐파일의 이름이 일치하지 않는 경우가 많다. 이것들을 따로 매핑해주자.

아래 `Map`의 `key`가 바꿀 대상, `value`가 바뀔 대상이다. 마찬가지로 아래 `Map`의 `key` 는 `Material.name.lowercase()` 에 해당한다.

일부 경우 정규식을 사용하므로, 구현은 `Regex` 를 사용하여야 한다.

```kotlin
val mappings = mapOf(
    "log" to "log_top",
    "wood" to "log_top",
    "(acacia|birch|dark_oak|oak|jungle|spruce|crimson|warped)_slab" to "$1_planks",
    "(acacia|birch|dark_oak|oak|jungle|spruce|crimson|warped)_stairs" to "$1_planks",
    "_slab" to "",
    "_stairs" to "",
    "hyphae" to "stem_top",
    "infested_" to "",
    "magma_block" to "magma",
    "snow_block" to "snow",
    "waxed_" to "",
    "dried_kelp_block" to "dried_kelp_top",
    "petrified_" to ""
)
```
> 일부 예외 처리(3)에 필요한 데이터

이제 텍스쳐의 색상을 추출할 준비가 됐다.

우선 유효한 블럭의 리스트인 `List<Material>` 을 순회하여, `Material.name.lowercase()` 를 진행하고 이름을 상황에 맞게 매핑한다.

그리고 최종적으로 나온 Material에 대한 텍스쳐 이름을, 전체 텍스쳐 목록으로부터 나온 `List<File>`에서 찾아 색상을 추출할 수 있다.

```kotlin
targets.map mapper@ { target ->
    val texture = mappings.entries
        .find { (key, _) -> target.name.lowercase().contains(Regex(key)) }
        ?.let { (key, value) -> target.name.replace(Regex(key), value) }
        ?: target
    
    val file = files.find { it.nameWithoutExtension == texture } ?: return@mapper null
    val color = colorExceptions[texture] ?: averageColor(file)
    
    target.key.key to color
}.filterNotNull().associate { it }
```
> Material 과 그의 색상을 매핑하는 코드

### 텍스쳐로부터 색상 추출

이제 색상을 추출해보자. 아래가 이미지로부터 색상을 추출하는 코드이다.

```kotlin
fun averageColor(textureFile: File): Color {
    val stream = ImageIO.createImageInputStream(textureFile)
    val iterator = ImageIO.getImageReaders(stream)

    if (!iterator.hasNext()) return null

    val image = iterator.next().let {
        it.input = stream
        it.read(0)
    }

    var r = 0f
    var g = 0f
    var b = 0f
    var pixels = 0
    ((0 until image.width) to (0 until image.height)).forEach { x, y ->
        val color = Color(image.getRGB(x, y))
        if (color.alpha != 1f) continue
        
        r += color.red * 255
        g += color.green * 255
        b += color.blue * 255
        pixels++
    }
    
    return Color((r / pixels).toInt(), (g / pixels).toInt(), (b / pixels).toInt()).hex
}
```
> 이미지로부터 평균 색상을 골라내는 코드

&nbsp;  
## 다다케!

이제 이걸 프론트에 줘야한다. 데이터 구조는 아래처럼 잡았다:
```kotlin
@Serializable
data class CompressedData(
    val limited: List<Long>, 
    val blocks: List<Long>, 
    val shadows: List<Long>
)

@Serializable
data class TerrainResponse(
    val compressed: CompressedData, 
    val palette: List<String>, 
    val colors: List<String?>
)
```
> 프론트에 최종적으로 전달할 데이터 구조

몇 개의 연산을 더해서 y좌표를 제한해 지형의 단면을 확인하거나, 그림자도 표현할 수 있게 했다.  
여기서 palette 는 블럭의 이름, colors 가 그 색상을 의미해서 사실 palette 는 꼭 필요하지 않지만 혹시 몰라서 전달하기로 했다.

## 프론트

프론트에서는 딱히 중요한게 없다.

그냥 서버에서 전달해준 데이터에서 압축된 부분을 역연산으로 해제하고, canvas 에 픽셀별로 순회하여 색상을 그려주면 된다.

그래서 결과물은?

![결과물](...image_base.../result.png)
> 와! 벚꽃 색 너무 예쁘게 나왔다!


