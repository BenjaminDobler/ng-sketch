{{#if hasDefs}}
<!-- START DEFS -->
<defs>
  {{#each style.shadows}}

  <filter id="filter-{{../$$id}}" height="140%" width="140%">
    <!--
    <feGaussianBlur in="SourceAlpha" stdDeviation="{{spread}}"/> <!-- stdDeviation is how much to blur -->
    <feOffset dx="{{offsetX}}" dy="{{offsetY}}" result="offsetblur"/> <!-- how much to offset -->
    <feMerge>
      <feMergeNode/> <!-- this contains the offset blurred image -->
      <feMergeNode in="SourceGraphic"/> <!-- this contains the element that the filter is applied to -->
    </feMerge>
    -->
    <feMorphology radius="0" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology>
                <feOffset dx="{{offsetX}}" dy="{{offsetY}}" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
                <feGaussianBlur stdDeviation="{{spread}}" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.3 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>

                <feMerge>
                      <feMergeNode/> <!-- this contains the offset blurred image -->
                      <feMergeNode in="SourceGraphic"/> <!-- this contains the element that the filter is applied to -->
                    </feMerge>
  </filter>

  {{/each}}

  {{#each masks}}
    <mask id="mask{{$$id}}">
    {{#each layers}}
      {{#if $$isRect}}
        <rect id="{{$$id}}" x="{{$$x}}" y="{{$$y}}" rx="{{$$rx}}" width="{{frame.width}}" height="{{frame.height}}" transform="{{$$transform}}" />
      {{else}}
        <path id="{{$$id}}" d="{{$$path}}" transform="{{$$transform}}" />
      {{/if}}
    {{/each}}
    </mask>
  {{/each}}

  {{#if $$shapeGroup}}
    {{#each linearGradients}}
      <linearGradient id="{{id}}" x1="{{x1}}" x2="{{x2}}" y1="{{y1}}" y2="{{y2}}">
        {{#each stops}}
          <stop stop-color="{{color}}" stop-opacity="{{opacity}}" offset="{{offset}}"></stop>
        {{/each}}
      </linearGradient>
    {{/each}}

    {{#each radialGradients}}
          <radialGradient id="{{id}}" x1="{{x1}}" x2="{{x2}}" y1="{{y1}}" y2="{{y2}}"></linearGradient>
            {{#each stops}}
              <stop stop-color="{{color}}" stop-opacity="{{opacity}}" offset="{{offset}}" ></stop>
            {{/each}}
          </radialGradient>
    {{/each}}

    {{#each layers}}
      {{#if $$drawAsCircle}}
        <circle id="{{$$id}}" cx="{{$$cx}}" cy="{{$$cy}}" r="{{$$radius}}"></circle>
      {{/if}}
      {{#if $$drawAsRect}}
        <rect id="{{$$id}}" x="{{$$x}}" y="{{$$y}}" rx="{{$$rx}}" width="{{frame.width}}" height="{{frame.height}}" transform="{{$$transform}}" ></rect>
      {{/if}}
      {{#if $$drawAsLine}}
        <line id="{{$$id}}" x1="{{$$x1}}" x2="{{$$x2}}" y1="{{$$y1}}" y2="{{$$y2}}" ></line>
      {{/if}}
      {{#if $$drawAsPath}}
        <path id="{{$$id}}" d="{{$$path}}" transform="{{$$transform}}" />
      {{/if}}
    {{/each}}

  {{/if}}
</defs>
<!-- END DEFS -->
{{/if}}

<!-- START USE -->
{{#if $$shapeGroup}}
  <g>
    {{#each layers}}
    {{#unless $$noDraw}}
      <use
      mask="url(#mask{{../$$maskId}})"
      {{#if ../$$hasFilter}}style="filter:url(#filter-{{../$$id}})"{{/if}}
      stroke="{{../$$strokeColor}}"
      stroke-width="{{../$$strokeWidth}}"
      fill="{{../$$fill}}"
      fill-rule="evenodd"
      fill-opacity="{{../$$opacity}}"
      xlink:href="#{{$$id}}"></use>
      {{/unless}}
    {{/each}}
  </g>
{{/if}}


{{#if $$bitmap}}
  <image id="{{$$id}}" x="{{$$x}}" y="{{$$y}}" rx="{{$$rx}}" width="{{frame.width}}" height="{{frame.height}}" transform="{{$$transform}}" xlink:href="{{$$imageData}}" mask="url(#mask{{$$maskId}})"> </image>
{{/if}}

{{#if $$text}}
<text id="{{$$id}}" fill="{{$$fontColor}}" fill-opacity="{{$$fillOpacity}}" font-size="{{$$fontSize}}" font-family="{{$$fontFamily}}" x="{{$$x}}" y="{{$$y}}" rx="{{$$rx}}" width="{{frame.width}}" height="{{frame.height}}" transform="{{$$transform}}" mask="url(#mask{{$$maskId}})" >
  {{#unless $$hasTextLines}}
  {{decodedTextAttributes.NSString}}
  {{/unless}}
  {{#if $$hasTextLines}}
    {{#each $$textLines}}
      <tspan x="{{x}}" dy="{{y}}">{{text}}</tspan>
    {{/each}}
  {{/if}}
</text>

{{/if}}


{{#each layers}}

{{#if $$artboard}}
<defs>
<clipPath id="artboardmask-{{$$id}}">
  <rect  x="{{$$x}}" y="{{$$y}}" rx="{{$$rx}}" width="{{frame.width}}" height="{{frame.height}}" transform="{{$$transform}}" />
  </clipPath>
</defs>
{{/if}}

<g {{#if $$artboard}}clip-path='url(#artboardmask-{{$$id}})'{{/if}}>
  {{> layer}}
  </g>
{{/each}}
