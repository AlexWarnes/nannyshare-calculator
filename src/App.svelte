<script>
  import CareEntry from "./components/CareEntry.svelte";
  import Rates from "./components/Rates.svelte";
  import domtoimage from "dom-to-image-more";
  import { saveAs } from "file-saver";
  import ImageReference32 from "carbon-icons-svelte/lib/ImageReference32";
  import Add32 from "carbon-icons-svelte/lib/Add32";

  import { newDefaultCareEntry } from "./utilities";
  import { rates, childcare } from "./stores";

  const handleAddNewEntryClick = (setName) => {
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
    domtoimage.toBlob(document.getElementById("body")).then(function (blob) {
      let time = new Date()
        .toLocaleString()
        .split(",")[0]
        .replace("/", "-")
        .replace("/", "-");
      saveAs(blob, `NannyShareCosts_${time}.png`);
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
          on:click={() => handleAddNewEntryClick(childcareSet.name)}
          ><Add32 style="transform: scale(.75)" />
        </button>
      </article>
    {/each}
  </section>
</main>
<footer class="flex sb">
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
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 0 18px;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    background-color: royalblue;
    color: #ffffff;
  }

  button.add-new {
    background: lightblue;
    width: 100%;
  }
</style>
