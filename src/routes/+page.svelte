<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import { listen } from "@tauri-apps/api/event";
  import { onMount } from "svelte";
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

  let message_send = $state("");
  let result = $state(false);

  let message_receive = $state("");

  async function send(event: Event) {
    event.preventDefault();
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    result = await invoke("send", { message: message_send });
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
  <h1>Welcome to Chat</h1>
  <ul>
    {#each msg_items as item, i}
      <li>
        <span>{item}</span>
        <button class="del" onclick={() => remove(i)}>×</button>
      </li>
    {/each}
  </ul>

  <div class="row">
    <a href="https://github.com/BirthAndDeath/chat" target="_blank">
      <img src="/logo.svg" class="logo chat" alt="Chat Logo" />
    </a>
  </div>
  <p>Click on the Chat logos to jump to githubpage.</p>

  <form class="row" onsubmit={send}>
    <input
      id="input-holder"
      placeholder="Enter message..."
      bind:value={message_send}
    />
    <button type="submit">Send</button>
  </form>
  <p>{result}</p>
</main>

<style>
  .logo.chat:hover {
    filter: drop-shadow(0 0 2em #818183);
  }

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
  }

  .container {
    margin: 0;
    padding-top: 10vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: 0.75s;
  }

  .row {
    display: flex;
    justify-content: center;
  }

  a {
    font-weight: 500;
    color: #646cff;
    text-decoration: inherit;
  }

  a:hover {
    color: #535bf2;
  }

  h1 {
    text-align: center;
  }

  input,
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

  input,
  button {
    outline: none;
  }

  #input-holder {
    margin-right: 5px;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      color: #f6f6f6;
      background-color: #2f2f2f;
    }

    a:hover {
      color: #24c8db;
    }

    input,
    button {
      color: #ffffff;
      background-color: #0f0f0f98;
    }
    button:active {
      background-color: #0f0f0f69;
    }
  }
</style>
