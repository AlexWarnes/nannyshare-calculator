<script>
  import { childcare, rates } from "../stores";
  const handleRateChange = () => {
    $rates = $rates;
    $childcare = $childcare;
  };
  import Person32 from "carbon-icons-svelte/lib/Person32";
</script>

<div class="rates-box">
  <h3>Hourly Cost per Person</h3>
  <div class="row flex sb">
    <span><Person32 style="transform: scale(.5)" /></span>
    <input
      type="number"
      bind:value={$rates["SINGLE"]}
      on:change={handleRateChange}
      step=".01"
    />
  </div>
  <div class="row flex sb">
    <span
      ><Person32 style="transform: scale(.5)" /><Person32
        style="transform: scale(.5)"
      /></span
    >
    <input
      type="number"
      step=".01"
      bind:value={$rates["DOUBLE"]}
      on:change={handleRateChange}
    />
  </div>
  <div class="row flex sb">
    <span
      ><Person32 style="transform: scale(.5)" /><Person32
        style="transform: scale(.5)"
      /><Person32 style="transform: scale(.5)" /></span
    >
    <input
      type="number"
      step=".01"
      bind:value={$rates["TRIPLE"]}
      on:change={handleRateChange}
    />
  </div>
</div>

<style>
  h3 {
    margin: 0 0 8px;
  }
  .rates-box {
    border: 1px solid slategray;
    border-radius: 5px;
    padding: 12px;
    width: 250px;
  }
  input {
    width: 100px;
  }
</style>
