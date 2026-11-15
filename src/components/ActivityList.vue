<script setup lang="ts">

import { computed, ref } from 'vue';
import type { VinylPlay } from '../types';

const props = defineProps<{
  vinylPlays: VinylPlay[],
  deleting?: boolean,
  onDelete?: (play: VinylPlay) => void,
}>()

type ActivityItem = VinylPlay & { dateString: string; timeString: string };
const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' } as const;
const timeOptions = { hour: 'numeric', minute: '2-digit' } as const;
const vinylActivity = computed(() => {
  return props.vinylPlays.map((a): ActivityItem => {
    const date = new Date(a.timestamp);
    return {
      ...a,
      dateString: date.toLocaleDateString('en-US', dateOptions),
      timeString: date.toLocaleTimeString('en-US', timeOptions),
    };
  });
});

const showTrash = ref<{ [id: string]: boolean }>({})
const toggleTrash = (row: ActivityItem) => {
  if (showTrash.value[row.playId]) {
    showTrash.value[row.playId] = false;
  } else {
    showTrash.value[row.playId] = true;
  }
}

</script>

<template>
  <div class="plays">
    <div
      class="play-item"
      v-for="row in vinylActivity"
      :style="{ backgroundColor: row?.albumColors?.length ? row.albumColors[1] + '50' : 'var(--color-tile)' }"
      @click="toggleTrash(row)"
    >
      <div class="album-info" @click="row.deleted ? undefined : $router.push(`/${row.vinylId}`)">
        <img class="album-art" :src="row.imageUrl" :alt="row.album">
        <div class="album-text">
          <div class="album">
            <span class="album-name">
              {{ row.album }}
            </span>
            <span class="album-sides" v-if="row.sides.length < row.nSides">
              {{ row.sides.join(', ') }}
            </span>
          </div>
          <div class="artist">{{ row.artist }}</div>
        </div>
      </div>
      <div class="play-item-right">
        <div>
          <div class="date">{{ row.dateString }}</div>
          <div class="time">{{ row.timeString }}</div>
        </div>
        <div v-if="showTrash[row.playId] && onDelete">
          <button :disabled="deleting" class="icon-button" @click="onDelete(row)">
            <img class="icon" src="../assets/icons/delete.png" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .icon-button {
    margin-right: 10px;
    width: 30px;
    height: 30px;
    background: none;
  }

  .plays {
    margin-bottom: 60px;
  }

  .play-item {
    display: flex;
    flex-direction: row;
    gap: 10px;
    padding: 4px;
    padding-right: 8px;
    align-items: center;
    justify-content: space-between;
    background-color: var(--color-tile);
    margin-bottom: 8px;
    cursor: pointer;
  }

  .play-item-right {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    gap: 10px;
    min-width: 80px;
    flex-shrink: 0;
  }

  .album-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    flex: 1;
    min-width: 0;
  }

  .album-art {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
  }

  .album-text {
    min-width: 0;
  }

  .album {
    display: flex;
    align-items: center;
    gap: 5px;
    min-width: 0;
  }

  .album-name {
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    line-height: 1.4;
  }

  .album-sides {
    color: var(--color-text-subtle);
    font-size: 14px;
    flex-shrink: 0;
    white-space: nowrap;
  }

  .artist {
    color: var(--color-text-subtle);
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .date, .time {
    text-align: right;
    margin-left: 4px;
    font-size: 15px;
  }

  .time {
    color: var(--color-text-subtle);
    font-size: 14px;
  }
</style>
