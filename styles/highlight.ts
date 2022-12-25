import { css } from "@emotion/react";

export const Highlight = css`
  .hljs {
    display: block;
    overflow-x: auto;
    padding: 10px 15px;
    border-radius: 5px 5px 0 0;
    background: #00000020;
  }

  .hljs {
    color: #bababa
  }

  .hljs-strong, .hljs-emphasis {
    color: #a8a8a2
  }

  .hljs-bullet, .hljs-quote, .hljs-link, .hljs-number, .hljs-regexp, .hljs-literal {
    color: #6896ba
  }

  .hljs-code, .hljs-selector-class {
    color: #a6e22e
  }

  .hljs-emphasis {
    font-style: italic
  }

  .hljs-keyword, .hljs-selector-tag, .hljs-section, .hljs-attribute, .hljs-name, .hljs-variable {
    color: #cb7832
  }

  .hljs-params {
    color: #b9b9b9
  }

  .hljs-string {
    color: #6a8759
  }

  .hljs-subst, .hljs-type, .hljs-built_in, .hljs-builtin-name, .hljs-symbol, .hljs-selector-id, .hljs-selector-attr, .hljs-selector-pseudo, .hljs-template-tag, .hljs-template-variable, .hljs-addition {
    color: #e0c46c
  }

  .hljs-comment, .hljs-deletion, .hljs-meta {
    color: #7f7f7f
  }
`
