<script>
  import CareEntry from "./components/CareEntry.svelte";
  import Rates from "./components/Rates.svelte";
  import domtoimage from "dom-to-image-more";
  import { saveAs } from "file-saver";
  import ImageReference32 from "carbon-icons-svelte/lib/ImageReference32";
  import Add32 from "carbon-icons-svelte/lib/Add32";
  import { fade, draw } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  import { newDefaultCareEntry } from "./utilities";
  import { rates, childcare } from "./stores";
  let adjustLayoutForImageCapture = false;

  const scrollTargetIntoView = (event) => {
    console.log("event", event);
    event.target
      .closest(".add-new")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAddNewEntryClick = (event, setName) => {
    const prevSet = $childcare.find((set) => set.name === setName);
    const nextSet = {
      ...prevSet,
      careEntries: [...prevSet.careEntries, newDefaultCareEntry()],
    };

    $childcare = $childcare.map((childcareSet) => {
      if (childcareSet.name === setName) {
        return nextSet;
      } else {
        return childcareSet;
      }
    });

    scrollTargetIntoView(event);
  };

  const handleRemoveEntry = (event, setName) => {
    const targetID = event.detail.id;
    const prevSet = $childcare.find((set) => set.name === setName);
    const nextSet = {
      ...prevSet,
      careEntries: prevSet.careEntries.filter((entry) => entry.id !== targetID),
    };

    $childcare = $childcare.map((childcareSet) => {
      if (childcareSet.name === setName) {
        return nextSet;
      } else {
        return childcareSet;
      }
    });
  };

  const handleSaveImg = () => {
    adjustLayoutForImageCapture = true;
    domtoimage
      .toBlob(document.getElementById("body"))
      .then(function (blob) {
        let time = new Date()
          .toLocaleString()
          .split(",")[0]
          .replace("/", "-")
          .replace("/", "-");
        saveAs(blob, `NannyShareCosts_${time}.png`);
      })
      .finally(() => {
        console.log("Complete");
        setTimeout(() => {
          adjustLayoutForImageCapture = false;
        }, 1000);
      });
  };

  $: {
    $childcare.forEach((set) => {
      let setCost = 0;
      for (let entry of set.careEntries) {
        setCost = setCost + entry.hours * $rates[entry.rate];
      }
      let newSet = { ...set, cost: setCost };
      $childcare = $childcare.map((childcareSet) => {
        if (childcareSet.name === newSet.name) {
          return newSet;
        } else {
          return childcareSet;
        }
      });
    });
  }

  let totalCost = 0;
  $: {
    let costArr = $childcare.map((set) => set.cost);
    totalCost = costArr.reduce((a = 0, v) => a + v);
  }
</script>

<header class="flex">
  <img src="/assets/calculator.png" alt="Calculator" width="40" />
  <h1>NannyShare</h1>
</header>
{#if adjustLayoutForImageCapture}
  <div class="saving-overlay" out:fade>
    <svg
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="#fafafa"
      width="64px"
      height="64px"
      viewBox="0 0 64 64"
      aria-hidden="true"
      ><path
        in:draw
        d="M7,31.36H1c-0.199,0-0.36-0.161-0.36-0.36v-6c0-0.199,0.161-0.36,0.36-0.36h6	c0.199,0,0.36,0.161,0.36,0.36v6C7.36,31.199,7.199,31.36,7,31.36z M1.36,30.64h5.28v-5.28H1.36V30.64z M31,28.36H11v-0.72h20V28.36	z M7,19.36H1c-0.199,0-0.36-0.161-0.36-0.36v-6c0-0.199,0.161-0.36,0.36-0.36h6c0.199,0,0.36,0.161,0.36,0.36v6	C7.36,19.199,7.199,19.36,7,19.36z M1.36,18.64h5.28v-5.28H1.36V18.64z M31,16.36H11v-0.72h20V16.36z M7,7.36H1	C0.801,7.36,0.64,7.199,0.64,7V1c0-0.199,0.161-0.36,0.36-0.36h6c0.199,0,0.36,0.161,0.36,0.36v6C7.36,7.199,7.199,7.36,7,7.36z M1.36,6.64h5.28V1.36H1.36V6.64z M31,4.36H11V3.64h20V4.36z"
      /></svg
    >
  </div>
{/if}
<main>
  <Rates />
  <section class="care">
    {#each $childcare as childcareSet (childcareSet.name)}
      <article>
        <div class="flex sb">
          <h2>{childcareSet.name}</h2>

          <span><strong>${childcareSet.cost.toFixed(2)}</strong></span>
        </div>
        {#each childcareSet.careEntries as careEntry (careEntry.id)}
          <CareEntry
            {careEntry}
            childcareSetName={childcareSet.name}
            on:removeEntry={(event) =>
              handleRemoveEntry(event, childcareSet.name)}
          />
        {/each}
        <button
          class="add-new"
          on:click={(event) => handleAddNewEntryClick(event, childcareSet.name)}
          ><Add32 style="transform: scale(.75)" />
        </button>
      </article>
    {/each}
  </section>
</main>
<footer class={`flex sb ${adjustLayoutForImageCapture ? null : "fixed"}`}>
  <h3>TOTAL COST: ${totalCost.toFixed(2)}</h3>
  <button on:click={handleSaveImg}
    ><ImageReference32 style="transform: scale(.75)" />Save</button
  >
</footer>

<style>
  header {
    width: 100%;
    background-color: #4169e1;
    color: #ffffff;
    padding: 12px;
  }
  header h1 {
    margin: 0 0 0 16px;
  }
  section.care article {
    background: aliceblue;
    border-radius: 5px;
    margin: 24px auto;
    padding: 0 8px 16px;
    box-shadow: 2px 2px 8px #00000028;
  }

  footer {
    padding: 0 18px;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    background-color: royalblue;
    color: #ffffff;
  }

  footer.fixed {
    position: fixed;
    bottom: 0;
    left: 0;
  }

  button.add-new {
    background: lightblue;
    width: 100%;
  }

  .saving-overlay {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: royalblue;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
  }
</style>
