<script>
  import { createEventDispatcher } from "svelte";
  import { rates, childcare } from "../stores";
  import { fly } from "svelte/transition";
  import Delete32 from "carbon-icons-svelte/lib/Delete32";

  const dispatch = createEventDispatcher();

  const removeEntry = (id) => {
    dispatch("removeEntry", {
      id,
    });
  };

  export let careEntry;
  export let childcareSetName;
  $: {
    careEntry = {
      ...careEntry,
      cost: careEntry.hours * $rates[careEntry.rate],
    };
  }

  const handleUpdateEntry = () => {
    const prevSet = $childcare.find((set) => set.name === childcareSetName);
    const nextSet = {
      ...prevSet,
      careEntries: prevSet.careEntries.map((entry) => {
        if (entry.id === careEntry.id) {
          return careEntry;
        } else {
          return entry;
        }
      }),
    };

    $childcare = $childcare.map((childcareSet) => {
      if (childcareSet.name === childcareSetName) {
        return nextSet;
      } else {
        return childcareSet;
      }
    });
  };
</script>

<div
  class="entry-row flex sb"
  in:fly={{ x: -10, duration: 250 }}
  out:fly={{ x: 10, duration: 250 }}
>
  <form on:submit|preventDefault class="flex" on:change={handleUpdateEntry}>
    <div class="input-wrapper">
      <label for={`hours-${careEntry.id}`}> Hours </label>
      <input
        class="hours-input"
        id={`hours-${careEntry.id}`}
        type="number"
        bind:value={careEntry.hours}
        min="0"
        step=".25"
      />
    </div>
    <div class="input-wrapper">
      <label for={`rate-${careEntry.id}`}> Rate </label>

      <select id={`rate-${careEntry.id}`} bind:value={careEntry.rate}>
        <option value="SINGLE">SINGLE</option>
        <option value="DOUBLE">DOUBLE</option>
        <option value="TRIPLE">TRIPLE</option>
      </select>
    </div>
    <span class="cost-text">${careEntry.cost.toFixed(2)}</span>
  </form>
  <button class="delete" on:click={() => removeEntry(careEntry.id)}
    ><Delete32 style="transform: scale(.5)" /></button
  >
</div>

<style>
  .entry-row {
    padding: 8px 12px 8px;
    margin: 0 0 12px 0;
    border-bottom: 1px solid #dddddd;
    transition: background-color 0.2s ease;
  }
  .entry-row:hover {
    background-color: #00000018;
  }
  button.delete {
    /* width: 40px;
    height: 40px; */
    border-radius: 50%;
    background-color: indianred;
    font-weight: 600;
    color: white;
  }

  form > * {
    margin: 0 12px 0 0;
  }

  .cost-text {
    margin: 10px 0 0 18px;
  }

  .hours-input {
    width: 75px;
  }
</style>
