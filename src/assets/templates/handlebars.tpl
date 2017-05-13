<!-- START DEFS -->
<defs>
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

<!-- START USE -->
{{#if $$shapeGroup}}
  <g>
    {{#each layers}}
      <use
      mask="url(#mask{{../$$maskId}})"
      stroke="{{../$$strokeColor}}"
      stroke-width="{{../$$strokeWidth}}"
      fill="{{../$$fill}}"
      fill-rule="evenodd"
      fill-opacity="{{../$$opacity}}"
      xlink:href="#{{$$id}}"></use>
    {{/each}}
  </g>
{{/if}}


{{#if $$bitmap}}
  <image id="{{$$id}}" x="{{$$x}}" y="{{$$y}}" rx="{{$$rx}}" width="{{frame.width}}" height="{{frame.height}}" transform="{{$$transform}}" xlink:href="{{$$imageData}}" mask="url(#mask{{$$maskId}})"> </image>
{{/if}}

{{#if $$text}}
<text id="{{$$id}}" fill="{{$$fontColor}}" fill-opacity="{{$$fillOpacity}}" font-size="{{$$fontSize}}" font-family="{{$$fontFamily}}" x="{{$$x}}" y="{{$$y}}" rx="{{$$rx}}" width="{{frame.width}}" height="{{frame.height}}" transform="{{$$transform}}" mask="url(#mask{{$$maskId}})" >
  {{decodedTextAttributes.NSString}}
</text>

{{/if}}


{{#each layers}}
  {{> layer}}
{{/each}}
