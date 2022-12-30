---
author: GoHoon
title: React 컴포넌트가 렌더링되기 전에 그 크기 가져오기
date: 2021-01-14, 11:14
categories: [dev,react]
---
렌더링되기 전에 컴포넌트의 크기를 알아야하는 경우에는 어떻게 대처하면 될지 알아보자. 깔끔한 방식은 아니지만.   
<!-- Excerpt -->

전체적인 과정은 다음과 같다.
1. 최초의 render에서는 빈 div를 렌더링하고 componentDidMount에서 내부 컴포넌트들의 크기를 계산하도록 지시한다.
2. 크기 계산 함수에서 ReactDOM.render를 호출해서 더미 div (#pre_render_target)에 임시로 컴포넌트를 렌더링한다.
3. 임시로 렌더링한 컴포넌트에 #pre_render_target의 childNodes[0]으로 접근하여 dimension을 가져온다.

이런 과정을 통해 dimension을 가져오게 되는데, 문제는 ReactDOM.render가 호출한다고 바로 렌더링을 진행하는 것이 아니기 때문에 콜백을 전달해야한다는 점이다.   
이러면 함수의 반환값으로 dimension을 돌려줄 수 없기 때문에, 모든 함수에 콜백을 따로 지정해줘야한다.   

말보다 코드라고 한다. 일단 먼저 코드를 보자.

```javascript
/* ... */
class AwesomeComponent extends React.Component {
    
    /* ... */
    
    getDimensions(components, onComplete) {
        let component_index = 0;
        let out_dimensions = [];
        let prerenderCallback = () => {
            component_index++;
            if (component_index < components.length) {
                this.prerender(components[component_index], out_dimensions, prerenderCallback);
            } else {
                onComplete(out_dimensions);
                ReactDOM.unmountComponentAtNode(document.getElementById("pre_render_target"));
            }
        }
        this.prerender(components[component_index], out_dimensions, prerenderCallback);
    }

    prerender(component, out_dimensions, next) {
        // Set #pre_render_target's dimension match with target component's parent's dimension here.
        ReactDOM.render(component,
            document.getElementById("pre_render_target"), () => {
                let renderedElement = document.getElementById("pre_render_target").childNodes[0];
                out_dimensions.push([renderedElement.offsetWidth, renderedElement.offsetHeight]);
                next();
            }
        );
    }
}
```
> AwesomeComponent.js

```html
...
<div id="pre_render_target" 
     style="position: fixed; z-index: -9999; opacity: 0;">
</div>
<div id="root"></div>
...
```
> index.html

코드는 생각보다 간단하긴 한데 상당히 더럽게 동작한다. 살펴보면 알겠지만 함수를 재귀호출하고 있으며 dimension을 가져올 컴포넌트가 많으면 많을수록 느려질 것이다.   

재귀호출을 쓰는 이유는 위에서도 말했듯 함수들이 호출된다고 바로 결과가 반영되고 다음 문장으로 넘어가는게 아니기 때문에 콜백을 통해 다음 문장으로 가야해서 값을 리턴하는게 불가능했기 떄문이다.   

그리고 prerender 함수의 첫 부분에서 미리 렌더링할 컴포넌트가 실제로 렌더링 될 컴포넌트(혹은 엘리먼트)의 dimension을 #pre_render_target에 적용해주어야 원하는 결과를
얻을 수 있기 때문에 거기에 또 ref를 붙힌다던지 하는 일을 해줘야한다.   

결론적으로는 `getDimension(components, onComplete);`를 호출하면, compoenents 리스트 안의 각 컴포넌트의 dimension을 가져오고 그것들을 리스트에 추가,
onComplete 콜백의 인수로 넘겨준다.   
그러면 그 리스트를 onComplete 콜백 안에서 가져와서 사용하면 된다. setState()를 호출해도 된다.   

components 인자는 ref가 아닌 JSX로 작성된 컴포넌트를 전달하면 되므로 각 컴포넌트에 굳이 ref를 붙힐 필요는 없고, 아마 그렇게 할 수도 없을 것이다(ref는 렌더링될 때 부착되기 때문에).   
단, 각 component에 key는 붙혀주어야 warning 로그가 뜨지 않을 것이다(리스트 안에 있는 컴포넌트에는 key가 있어야 하므로)   

거듭 강조하지만 절대 좋은 방법이 아닌 것 같다. 다른 방법이 있다면 그게 더 좋을 확률이 높고, 이렇게 하면 페이지 로드 지연의 원인이 된다.   
가능하면 다른 방법이 없나를 찾아보도록 하자.   

설명 안한 부분이 많지만 귀찮으니까(???) 여기까지만 써야지.
