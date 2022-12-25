import { css } from "@emotion/react";

export const Markdown = css`
  & table {
    border-color: #FFFFFFBB;
    table-layout: fixed;
  }

  & table td, th {
    border-color: #FFFFFFBB;
  }

  & del {
    opacity: 0.55;
  }

  & ul, ol {
    padding-inline-start: 20px;
  }

  & h1, h2, h3, h4, h5, h6 {
    color: #FFFFFF;
  }

  & .math-inline {
    max-width: 100%;
    line-height: 100%;
    //margin-bottom: -11px;
    //margin-top: 10px;
    display: inline-block;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    color: #FFFFFF;
    padding-right: 3px;
  }

  & table .math-inline {
    margin-bottom: 0;
  }

  & .image-description {
    text-align: center;
    color: #FFFFFF90;
    font-size: 14px;
    margin-top: -15px;
  }

  & code {
    font-family: "JB-M-NL-R", sans-serif !important;
    font-size: 13px;
    line-height: 150%;
  }

  & .code-fragment-name {
    margin: -0.5em 0 0 0;
    font-size: 13px;
    background-color: #00000040;
    padding: 2px 15px;
    font-family: "JB-M-NL-R", sans-serif;
    border-radius: 0 0 5px 5px;
  }

  & pre {
    margin: 0;
  }

  & pre.important {
    background-color: #00000020;
    padding: 15px;
    border-radius: 5px;
    font-family: "JB-M-R", sans-serif;
    font-size: 0.75em;
    overflow-x: auto;
  }

  & .pre_child {
    line-height: 175%;
  }
  
  & .pre_child:after {
    content: "  ";
  }

  & a {
    color: #FFFFFF;
    text-decoration: underline;
  }

  & blockquote {
    & p {
      margin: 0;
    }
    margin: 0;
    background-color: #FFFFFF10;
    padding: 15px 25px;
    border-left: 5px solid #78a718;
    border-radius: 5px;
  }
`
