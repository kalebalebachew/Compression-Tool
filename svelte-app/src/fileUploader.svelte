<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
  
    let selectedFile;
    let compressedData = writable(null);
    let errorMessage = writable(null);
  
    const uploadFile = async () => {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
  
        const response = await fetch('http://localhost:5000/compress', {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const result = await response.json();
        compressedData.set(result.compressedData);
        errorMessage.set(null);
      } catch (error) {
        console.error(error);
        errorMessage.set('Error during file compression');
        compressedData.set(null);
      }
    };
  </script>
  
  <main>
    <input type="file" on:change={(e) => (selectedFile = e.target.files[0])} />
    <button on:click={uploadFile}>Compress File</button>
  
    {#if compressedData}
      <div>
        <h2>Compressed Data:</h2>
        <p>{compressedData}</p>
      </div>
    {/if}
  
    {#if errorMessage}
      <div style="color: red;">
        <p>{errorMessage}</p>
      </div>
    {/if}
  </main>
  
  <style>
    main {
      text-align: center;
      margin: 20px;
    }
  
    input {
      margin-bottom: 10px;
    }
  </style>
  