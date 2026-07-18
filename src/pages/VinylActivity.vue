<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { deleteVinylPlay, getVinylActivity } from '../services/vinyls';
import type { VinylPlay } from '../types';

type ActivityItem = VinylPlay & { dateString: string; timeString: string; showTrash: boolean };

const vinylActivity = ref<ActivityItem[]>([]);
const loading = ref(false);
const deleting = ref(false);

const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' } as const;
const timeOptions = { hour: 'numeric', minute: '2-digit' } as const;

onMounted(async () => {
  loading.value = true;
  try {
    const result = await getVinylActivity();
    vinylActivity.value = result.map((a) => {
      const date = new Date(a.timestamp);
      return {
        ...a,
        dateString: date.toLocaleDateString('en-US', dateOptions),
        timeString: date.toLocaleTimeString('en-US', timeOptions),
        showTrash: false,
      };
    });
  } finally {
    loading.value = false;
  }
});

const isToday = (timestamp: string) => {
  const d = new Date(timestamp);
  const now = new Date();
  return d.getFullYear() === now.getFullYear()
    && d.getMonth() === now.getMonth()
    && d.getDate() === now.getDate();
};

const nowPlaying = computed(() =>
  vinylActivity.value[0] && isToday(vinylActivity.value[0].timestamp)
    ? vinylActivity.value[0]
    : null
);

const historyItems = computed(() =>
  nowPlaying.value ? vinylActivity.value.slice(1) : vinylActivity.value
);

const deletePlay = async (row: ActivityItem) => {
  deleting.value = true;
  await deleteVinylPlay(row.vinylId, row.playId);
  deleting.value = false;
  vinylActivity.value = vinylActivity.value.filter((a) => a.playId !== row.playId);
}

</script>

<template>
  <div v-if="loading" class="loading">Loading...</div>
  <div v-if="nowPlaying">
    <div
      class="now-playing"
      :style="{ backgroundColor: nowPlaying.albumColors?.length ? nowPlaying.albumColors[0] + '80' : 'var(--color-tile)' }"
      @click="$router.push(`/crate/${nowPlaying.vinylId}`)"
    >
      <div class="now-playing-label">
        <div>Now Playing</div>
        <button :disabled="deleting" class="icon-button" @click.stop="deletePlay(nowPlaying)">
          <img class="icon" src="../assets/icons/delete.png" />
        </button>
      </div>
      <div class="now-playing-body">
        <img class="now-playing-art" :src="nowPlaying.imageUrl" :alt="nowPlaying.album" />
        <div class="vinyl-disc">
          <div
            class="vinyl-disc-name"
            :style="{ backgroundColor: nowPlaying.albumColors?.[0] ?? 'var(--color-tile-deep)' }"
          >{{ nowPlaying.album }}</div>
        </div>
        <div class="now-playing-info">
          <div class="now-playing-album">
            {{ nowPlaying.album }}
          </div>
          <div class="now-playing-artist">{{ nowPlaying.artist }}</div>
          <div class="now-playing-artist">{{ nowPlaying.timeString }}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="plays" v-if="historyItems.length > 0">
    <div
      class="play-item"
      v-for="row in historyItems"
      :style="{ backgroundColor: row?.albumColors?.length ? row.albumColors[0] + '70' : 'var(--color-tile)' }"
      @click="row.showTrash=!row.showTrash"
    >
      <div class="album-info" @click="$router.push(`/crate/${row.vinylId}`)">
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
        <div v-if="row.showTrash">
          <button :disabled="deleting" class="icon-button" @click="deletePlay(row)">
            <img class="icon" src="../assets/icons/delete.png" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .loading {
    padding: 32px 0;
    text-align: center;
    color: var(--color-text-subtle);
  }

  .icon-button {
    margin-right: 10px;
    width: 30px;
    height: 30px;
    background: none;
  }

  .now-playing {
    padding: 8px;
    margin-bottom: 8px;
    border-radius: 4px;
    cursor: pointer;
    background-color: var(--color-tile);
  }

  .now-playing-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-subtle);
    margin-bottom: 6px;
  }
  
  .now-playing-label .icon-button {
    width: 20px;
    height: 20px;
  }
  
  .now-playing-label .icon-button img {
    width: 15px;
    height: 15px;
  }

  .now-playing-body {
    display: flex;
    flex-direction: row;
    gap: 16px;
  }

  .vinyl-disc {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-left: -64px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: spin 3s linear infinite;
    background:
      conic-gradient(from 0deg,
        hsla(0, 0%, 100%, 0) 0deg,
        hsla(0, 0%, 100%, 0.22) 20deg,
        hsla(0, 0%, 100%, 0) 55deg,
        hsla(0, 0%, 100%, 0) 360deg),
      repeating-radial-gradient(circle at center,
        hsl(0, 0%, 8%) 0 2px,
        hsl(0, 0%, 14%) 2px 4px),
      hsl(0, 0%, 10%);
    box-shadow: 0 1px 3px hsla(0, 0%, 0%, 0.35);
  }

  .vinyl-disc-name {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-size: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 0 2px hsl(0, 0%, 6%);
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .now-playing-art {
    width: 90px;
    height: 90px;
    flex-shrink: 0;
    z-index: 2;
  }

  .now-playing-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow: hidden;
  }

  .now-playing-album {
    font-size: 20px;
    font-weight: bold;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .now-playing-artist {
    color: var(--color-text-subtle);
    font-size: 15px;
  }

  .now-playing-sides {
    color: var(--color-text-subtle);
    font-size: 13px;
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
