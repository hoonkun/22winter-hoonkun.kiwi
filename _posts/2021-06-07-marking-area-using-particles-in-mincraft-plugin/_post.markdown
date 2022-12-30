---
author: GoHoon
title: 마인크래프트 Particle을 사용해 월드의 특정 영역에 경계선을 그려보자
date: 2021-06-07, 15:40
categories: [dev,minecraft-plugin]
expand:
  max_columns: 1
  max_rows: 2
---
Particle을 사용해 그림처럼 특정 영역에 경계선을 그리는 방법을 알아보자. 현재 플레이어의 위치를 기반으로 그리기 때문에 지하에서도, 지상에서도 표시된다.   
<!-- Excerpt -->

## 서론
지금 제작중인 플러그인에서 월드의 특정 영역에 경계선을 표시할 필요가 생겨서, 어떻게 구현을 하면 좋을지 고민을 좀 하다가 어찌저찌 좋은 결과물을 만들어내서 여기다가도 적어보려한다.   
처음 짠 알고리즘, 그리고 그것을 보완한 두 번째 알고리즘을 같이 소개해볼 것이다.

## 본론
처음 짰던 알고리즘은... 간단하다면 간단하고 복잡하다면 복잡하다.   
우선, 대각선 경계선는 없고(마인크래프트니까...), 경계선을 그릴 영역을 구성하는 각 변의 시작점, 끝점이 data class(2차원 배열도 문제 없음)에 있다고 가정한다.   
`outline.start`가 시작점, `outline.end`가 끝점이라고 가정한다.   

코드를 보면 다음과 같다:   
```kotlin
parent.server.onlinePlayers.forEach { player ->
    // Insert if here if you want to draw area outlines only specific world.
    // ex: if (player.environment == World.Environment.NORMAL)
    
    areaOutlines.forEach { outline ->
        
        val horizontal = outline.start.x == outline.end.x
        val outlineLength = if (horizontal) 
            (outline.end.z - outline.start.z).absoluteValue
        else
            (outline.end.x - outline.start.x).absoluteValue
        
        for (offset in 0 until outlineLength) {
            val x = outline.start.x
            var y = player.location.y.toInt()
            val z = outline.start.z

            var block = player.world.getBlockAt(x, y, z)
            if (!(block.type.isBlock && block.type.isSolid)) {
                while (!(block.type.isBlock && block.type.isSolid) && y > 0) {
                    block = player.world.getBlockAt(x, --y, z)
                }
                y++
            } else {
                while (block.type.isBlock && block.type.isSolid && y < 255) {
                    block = player.world.getBlockAt(x, ++y, z)
                }
            }

            player.spawnParticle(
                Particle.REDSTONE,
                Location(player.world, x + 0.5, y + 0.02, z + 0.5),
                3,
                if (horizontal) 0.0 else 0.2, 0.0, if (horizontal) 0.2 else 0.0,
                0.75,
                Particle.DustOptions(colors[Random.nextInt(colors.indices)], 1.0f)
            )
        } // End of 'offset' for loop
        
    } // End of 'outline' forEach loop
} // End of 'player' forEach loop
```
> runnable.BorderParticleCreator

이게 파티클을 딱 한 번 그리는 코드이다. 이걸 이제 BukkitRunnable같은 곳에 넣으면 되는 것이다.   

이 포스트에서 중요하게 다루려고 하는 것은 **'어떻게 하면 지상과 지하 모두에서 보이는 영역 경계선을 그릴 수 있을까'** 이다.   

설명을 해보면 다음과 같다:   
- 경계를 그릴 위치 중 현재 플레이어의 y위치에 있는 블록이 '공기' 라면, 이게 공중에 있는 공기인지 지면 바로 위에있는 공기인지 알 수 없다. 따라서 고체 블록이 될 때까지 아래로 1칸씩 내려가되, 고체 블록을 만나면 다시 1을 추가하고 반복을 종료한다.
- 경계를 그릴 위치 중 현재 플레이어의 y위치에 있는 블록이 '고체' 블럭이라면 이 위치에 경계를 그리면 안된다. 따라서 고체가 아닌 블록이 될 때까지 위로 1칸씩 올라간다.   

이렇게 하면 대충 원하는 느낌의 경계가 잘 그려지는 듯 하다.   

사진들을 살펴보자. 아래의 세 사진은 모두 같은 영역을 표시하고 있으며 y의 위치만 바뀌었다.   
![공중](...image_base.../in_air.png)
> 공중에서 지면을 바라보고 찍은 사진

![지면](...image_base.../on_ground.png)
> 지면에서 찍은 사진

![지하](...image_base.../under_ground.png)
> 지하에서 찍은 사진

와ㅡ 이 정도면 꽤 잘 한 것 아닌가?
과연 정말 그런지, 다음 사진을 보자:   

![기대하지 않은](...image_base.../unexpected.png)
> 아래쪽 영역이 보이지 않는다...

알고리즘 상 이런 식으로 배치가 되어있으면 눈에 보이는 곳은 아래쪽임에도 아래쪽에 경계가 표시되지 않는다.   
이럴 경우 아래에 보이는 필드로 내려가면 그 때는 경계가 표시되지만 지금같은 위치에서는 표시가 안된다...   

그래서 음... 일단... 해결은 했다.   
아래의 수정된 코드를 보자.

```kotlin
val playerY = player.location.y
var overY = playerY.toInt()
var belowY = playerY.toInt()

var block = world.getBlockAt(x.toInt(), playerY.toInt(), z.toInt())

if (block.type.isBlock && block.type.isSolid) {
    while (block.type.isBlock && block.type.isSolid && overY < 255) {
        block = world.getBlockAt(x.toInt(), ++overY, z.toInt())
    }
    block = world.getBlockAt(x.toInt(), playerY.toInt(), z.toInt())
    while (block.type.isBlock && block.type.isSolid && belowY > 0) {
        block = world.getBlockAt(x.toInt(), --belowY, z.toInt())
    }
}

block = world.getBlockAt(x.toInt(), belowY, z.toInt())
while (!(block.type.isBlock && block.type.isSolid) && belowY > 0) {
    block = world.getBlockAt(x.toInt(), --belowY, z.toInt())
}
belowY++

var targetY = if (overY != playerY.toInt() && overY - playerY <= 1.55) overY else belowY

player.spawnParticle(
    Particle.REDSTONE,
    Location(world, x + 0.5, targetY + 0.02, z + 0.5),
    3,
    if (horizontal) 0.0 else 0.2, 0.0, if (horizontal) 0.2 else 0.0,
    0.75,
    Particle.DustOptions(colors[Random.nextInt(colors.indices)], 1.0f)
)
```
> runnable.BorderParticleCreator

코드가 바뀌었다. 위의 코드는 가장 간단한 형태로 바꾼거라 그냥 보면 약간 이해가 안갈 수도 있을 것 같다.   

마찬가지로 설명을 해보자면, 현재 경계를 그리려는 위치의 블럭이 공기가 아닐 경우 위와 아래로 동시에 이동한다.   
그리고 위로 2칸 이상 이동하면 쳐다봐봤자 안보이는 위치일 것이므로 해당 위치는 폐기하고 아래로 이동하여 그리도록 변경했다.   

그래서 최종적으로 위와 같은 상황에서도 아래처럼 잘 그린다:   
![기대한](...image_base.../expected.png)
> 와! 샌...

그래서 일단... 결론적으로 이 정도 결과물이면 딱히 더 불편함은 없지 싶다.   
그래서 이번 글은 여기까지고... 월드의 특정 영역에 경계선을 그리고싶은 플러그인 개발자분에게 도움이 되면 좋겠다.
