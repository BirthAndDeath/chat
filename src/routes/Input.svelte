<script lang="ts">
    import { invoke } from "@tauri-apps/api/core";

    let message_send = $state("");
    let result = $state(false);
    async function send(event: Event) {
        //add(message_send); add to history todo!
        event.preventDefault();
        // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
        result = await invoke("send", { message: message_send });
    }
</script>

<div class="row">
    <form onsubmit={send}>
        <textarea
            id="input-holder"
            placeholder="Enter message..."
            bind:value={message_send}
            maxlength="500"
            rows="3"
        ></textarea><button type="submit" id="button">Send</button>
    </form>
</div>

<style>
    .row {
        display: grid;

        width: 100%;
        height: 100%;
    }
    #input-holder {
        height: 85%;
        width: 75%;
        min-width: 0;
        resize: none !important;
        overflow-y: auto;
    }
    #button {
        transform: translateY(-25px);
        height: 85%;
        width: 15%;
        min-width: 0;
    }
</style>
