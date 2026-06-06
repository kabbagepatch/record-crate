<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { deleteVinylPlay, getVinylActivity } from '../services/vinyls';
import type { VinylPlay } from '../types';

type ActivityItem = VinylPlay & { dateString: string; timeString: string; showTrash: boolean };

const vinylActivity = ref<ActivityItem[]>([]);
const loading = ref(false);

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

const deletePlay = async (row: ActivityItem) => {
  await deleteVinylPlay(row.vinylId, row.playId);
  vinylActivity.value = vinylActivity.value.filter((a) => a.playId !== row.playId);
}

</script>

<template>
  <div v-if="loading" class="loading">Loading...</div>
  <div class="plays">
    <div
      class="play-item"
      v-for="row in vinylActivity"
      :style="{ backgroundColor: row?.albumColors?.length ? row.albumColors[0] + '30' : 'rgb(41, 41, 41)' }"
      @click="row.showTrash=!row.showTrash"
    >
      <div class="album-info" @click="$router.push(`/catalog/${row.vinylId}`)">
        <img class="album-art" :src="row.imageUrl" :alt="row.album">
        <div>
          <div class="album">
            <span class="album-name" :style="{ color: row?.albumColors?.length ? row.albumColors[0] : 'white' }">
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
          <button class="icon-button" @click="deletePlay(row)">
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
    color: #b3b3b3;
  }

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
    background-color: rgb(41, 41, 41);
    margin-bottom: 8px;
    cursor: pointer;
  }

  .play-item-right {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    gap: 10px;
  }

  .album-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  .album-art {
    height: 50px;
  }

  .album {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .album-name {
    font-weight: bold;
    max-width: 160px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }

  .album-sides {
    color: #b3b3b3;
    font-size: 14px;
  }

  .artist {
    color: rgb(190, 190, 190);
    font-size: 15px;
  }

  .date, .time {
    text-align: right;
    margin-left: 4px;
    font-size: 15px;
  }

  .time {
    color: #b3b3b3;
    font-size: 14px;
  }
</style>
