<script lang="ts">
  import "../lib/i18n";
  import { _ } from "svelte-i18n";

  import { listen } from "@tauri-apps/api/event";
  import { onMount } from "svelte";
  import Input from "./Input.svelte";
  let msg_items = $state([""]);

  function add(input: string) {
    if (input.trim()) {
      msg_items = [...msg_items, input.trim()];
      input = "";
    }
  }
  function remove(index: number) {
    msg_items = msg_items.filter((_, i) => i !== index);
  }

  onMount(() => {
    let unlisten: (() => void) | undefined;

    (async () => {
      unlisten = await listen("chat-message", (event) => {
        console.log("收到消息:", event.payload);
        console.log("payload:", event.payload);
        console.log("type:", typeof event.payload);
        if (typeof event.payload === "string") {
          msg_items = [...msg_items, event.payload];
        }
      });
    })();

    return () => {
      if (unlisten) unlisten();
    };
  });
</script>

<main class="container">
  <div class="top-right">
    <ul>
      {#each msg_items as item, i}
        <li>
          <span>{item}</span>
          <button class="del" onclick={() => remove(i)}>×</button>
        </li>
      {/each}
    </ul>
  </div>
  <div class="top-left"></div>
  <div class="bottom-right">
    <Input />
  </div>
  <a href="./about" title={$_("about")}>{$_("about")}</a>
</main>

<style>
  :root {
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;

    color: #0f0f0f;
    background-color: #f6f6f6;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
    appearance: none;
    -webkit-appearance: none;
  }

  .container {
    margin: 0;
    padding-top: 10vh;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    justify-items: center;
    align-items: center;
    text-align: center;
  }

  .top-right {
    position: absolute;
    top: 10px;
    right: 10px;
    max-width: 300px;
    overflow-y: auto;
  }
  .bottom-right {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 60%;
    box-sizing: border-box;
    padding: 10px;
  }

  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    color: #0f0f0f;
    background-color: #ffffff;
    transition: border-color 0.25s;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  }

  button {
    cursor: pointer;
  }

  button:hover {
    border-color: #396cd8;
  }
  button:active {
    border-color: #396cd8;
    background-color: #e8e8e8;
  }

  button {
    outline: none;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      color: #f6f6f6;
      background-color: #2f2f2f;
    }

    button {
      color: #ffffff;
      background-color: #0f0f0f98;
    }
    button:active {
      background-color: #0f0f0f69;
    }
  }
</style>
