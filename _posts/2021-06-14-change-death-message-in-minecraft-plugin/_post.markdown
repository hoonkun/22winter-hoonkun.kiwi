---
layout: post.liquid
author: GoHoon
title: 마인크래프트의 DeathMessage를 플러그인을 사용해 바꿔보자
date: 2021-06-15, 4:17
image: /assets/images/posts/2021-06-14-change-death-message-in-minecraft-plugin/preview.png
categories: [dev,minecraft-plugin]
excerpt_separator: <!-- Excerpt -->
use_code_fragment: true
---
마인크래프트에서 플레이어가 내 플러그인의 <code>Entity.damage(Double)</code>에 의해 사망했을 때 출력되는 DeathMessage를 바꾸는 방법에 대해 알아보자.   
<!-- Excerpt -->
&nbsp;   

## 서론
마인크래프트 플러그인을 만들다 보면, 플러그인의 룰에 어긋나거나 해서 플레이어에게 대미지를 입혀 죽게했을 때는 기본으로 출력되는 메시지와 다른걸 출력하고싶어질 때가 있다.   
정확히는, <code>Entity.damage(Double)</code>를 사용해 플레이어에게 대미지를 입혀서 플레이어가 죽었을 경우 출력되는 메시지를 바꾸려는 것이다.   
&nbsp;   
기본적으로는 되게 삭막한, 어찌보면 너무 삭막해서 약간 무서운 느낌도 드는 'player_name is died.' 라는 메시지가 출력되는데, 이걸 다르게 바꿀 수 있다.   
그 방법에 대해 알아보자.   
&nbsp;   

## 본론
<code>PlayerDeathEvent</code> 라는 클래스는 <code>Event</code>를 확장하며 그 맴버로 <code>deathMessage</code>를 갖는다. 이것을 <code>Listener</code>를 확장하는 클래스의 <code>EventHandler</code>의 매개변수로 전달하면,
플레이어가 죽었을 때 <code>deathMessage</code>를 변경해줄 수 있다.   
&nbsp;   
하지만 이렇게 하면 마인크래프트의 시스템 내에서 죽었을 때(용암에 빠졌다던지 높은 곳에서 떨어졌다던지)에도 변경한 메시지가 출력되기 때문에, 정확하게 '이 플레이어가 내 플러그인에 의해 죽었는지'를 판별할 방법이 필요하다.   
&nbsp;   

### BukkitRunnable
말보다 코드가 나을 것 같으니 아래 코드를 보자.   
제작중인 플러그인에서 룰을 어겼을 시 <code>BukkitRunnable</code>을 이용하여 1초 마다 플레이어에게 대미지를 입히는 코드 부분이다.   
<pre><code class="language-kotlin"><span style="opacity: 0.6">parent.server.onlinePlayers.filter {
    </span>it.health > 0<span style="opacity: 0.6"> && /*checking rule here*/
}.forEach {
    val damageAmount = if (it.world.difficulty == Difficulty.PEACEFUL) 5.0 else 2.0</span>
    /* G.DEATH_BY_PLUGIN: MutableMap&lt;UUID, Boolean&gt; */
    if (it.health <= damageAmount && G.DEATH_BY_PLUGIN[it.uniqueId] != true) {
        G.DEATH_BY_PLUGIN[it.uniqueId] = true
    }
    it.damage(damageAmount)
<span style="opacity: 0.6">}</span></code></pre>
<div class="code-fragment-name">runnable.PlayerRuleChecker</div>
진하게 표시된 부분이 중요한 부분이다. 플레이어의 체력이 0보다 크고 룰을 어겼을 경우에만 대미지를 입히되,
**대미지를 입히기 전에 먼저 '이만큼의 대미지를 입혔을 때 플레이어가 죽는가?'를 체크**하여 '참'이라면 <code>G.DEATH_BY_PLUGIN[player.uniqueId]</code>의 값을 <code>true</code>로 바꾼다.   
&nbsp;   
대미지를 입힌 후에 체력이 0보다 작은지 비교하여 플래그를 설정해주지 않는 이유는, <code>Entity.damage(Double)</code>을 실행하는 과정에서 플레이어가 대미지를 입어서 죽었을 경우 다음 문장으로 넘어가기 전에
<code>PlayerDeathEvent</code>가 호출이 되기 때문이다.   
즉, <code>Entity.damage(Double)</code>를 수행한 뒤에 플래그를 설정하면 <code>PlayerDeathEvent</code>에서는 해당 플레그가 변화없는것으로 간주하게 된다는 뜻이다.   
그렇기 때문에 대미지를 입히기 전에 미리 플레이어가 죽는지를 체크할 필요가 있다는 것이다.   
&nbsp;   

### PlayerDeathByPluginListener
이제 플래그를 설정했으니 그것을 참조해서 <code>deathMessage</code>를 변경해보자. 이것은 어렵지 않다. 다음 코드를 보자:   
<pre><code class="language-kotlin"><span style="opacity: 0.6">class PlayerDeathByWaffleEvent: Listener {
    @EventHandler
    fun onPlayerDeathByPlugin(event: PlayerDeathEvent) {</span>
        if (G.DEATH_BY_PLUGIN[event.entity.uniqueId] == true) {
            event.deathMessage = "고훈 군이 포스트를 쓰다 죽었습니다... 좀 자라고 (ㅋㅋㅋ)"
            G.DEATH_BY_PLUGIN[event.entity.uniqueId] = false
        }
    <span style="opacity: 0.6">}
}</span></code></pre>
<div class="code-fragment-name">listener.PlayerDeathByPluginListener</div>
보다시피 단순하다. <code>G.DEATH_BY_PLUGIN[event.entity.uniqueId]</code>를 참조해 값을 비교하여 '참'이면 플러그인에 의해 죽은것으로 간주하고 
<code>deathMessage</code>를 변경하고있다. 그리고 설정되었던 플래그를 초기화하고있다.   
&nbsp;   
혹시나 해서 남겨두는데, if문에서 <code>MutableMap</code>의 <code>value</code>의 타입이 <code>Boolean</code>인데 어째서 <code>true</code>와 직접 비교연산을 하고 있냐면 
<code>Map</code>에 접근하면 <code>Boolean?</code>이 리턴되기 때문이다(<code>null</code>인지 <code>Boolean</code>인지 알 수 없음).   
&nbsp;   
&nbsp;   
결론적으로, 가장 중요한 것은 **대미지를 입히기 전에 미리 이 대미지를 입혔을 때 플레이어가 죽는지를 체크하여 플래그를 설정**해야한다는 것이고 <code>PlayerDeathEvent</code>에서 그 플래그를 체크하여 
<code>deathMessage</code>를 변경해주면 된다.   
&nbsp;   

### Listener 적용
마지막으로 만든 <code>Listener</code>를 플러그인에 등록해주면 된다. 다음 문장을 사용하자:   
<pre><code class="language-kotlin">server.pluginManager.registerEvents(PlayerDeathByPluginListener(), this)</code></pre>
<div class="code-fragment-name">listener.Entry</div>
&nbsp;   

## 결론
플러그인 제작 중 어떻게 하면 <code>deathMessage</code>를 커스텀할 수 있을 지에 대해 알아보다가 <code>DamageCause.CUSTOM</code>이라는것도 있다는 것을 알게 되었는데, 
이건 모든 플러그인을 통틀어서 체크하기 때문에 다른 플러그인에 죽었을 때에도 내 플러그인에 죽은 것 처럼 메시지가 출력될 우려가 있었다. 그래서 그것을 사용하지 않은 것이다.   
&nbsp;   
아무튼, 포스트를 쓰면서 코드를 살펴보다가 잘못 짠 부분이 있어서 급하게 포스팅을 마무리하고 서버에 플러그인을 업데이트하러 가야할 것 같다 (ㅋㅋㅋ)