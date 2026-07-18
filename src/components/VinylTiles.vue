<script setup lang="ts">
import type { Vinyl } from '../types';


defineProps<{
  vinyls: Vinyl[]
}>()

</script>

<template>
  <div class="albums">
    <div
      class="album-tile"
      :style="{ backgroundColor: vinyl?.albumColors?.length ? vinyl.albumColors[0] + '90' : 'var(--color-tile)' }"
      v-for="vinyl in vinyls"
      @click="$router.push(`/crate/${vinyl.id}`)"
    >
      <img v-if="vinyl.imageUrl" class="album-art" :src="vinyl.imageUrl" :alt="vinyl.album">
      <div v-else class="album-art" :style="{ marginBottom: '10px', backgroundColor: 'var(--color-black)' }" />
      <div v-if="vinyl.favorite" class="icon-container"><img class="icon" src="../assets/icons/heart-filled.png" /></div>
      <div class="album">{{ vinyl.album }}</div>
      <div class="artist">{{ vinyl.artist }}</div>
    </div>
  </div>
</template>

<style scoped>
  .albums {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 0;
  }

  .album-tile {
    position: relative;
    width: 105px;
    height: 160px;
    background-color: var(--color-tile);
    padding: 6px 8px;
    border-radius: 5px;
    cursor: pointer;
    transition: box-shadow 0.25s;
  }

  .album-tile:hover {
    box-shadow: 0 0 3px var(--color-text-subtle), 0 0 2px var(--color-text-muted);
  }

  .album-art {
    position: relative;
    width: 102px;
    height: 102px;
  }

  .album {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4em;
  }

  .artist {
    color: var(--color-text-subtle);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 15px;
  }

  .icon-container {
    position: absolute;
    top: 0;
    right: 0;
    text-align: right;
    margin-top: 8px;
    margin-right: 12px;
  }
  
  .icon {
    float: right;
    width: 12px;
  }
</style>
