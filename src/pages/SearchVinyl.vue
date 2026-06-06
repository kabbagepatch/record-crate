<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import VinylList from '../components/VinylList.vue';
import { searchVinyls } from '../services/vinyls';
import type { Vinyl } from '../types';

const router = useRouter();
const route = useRoute();

const selectVinyl = (vinyl: Vinyl) => {
  router.push(`/catalog/add/${vinyl.discogsId}`);
}

const results = ref<Vinyl[]>([]);
const loading = ref(false);
const search = ref(route.query?.search as string);

const searchAlbum = async () => {
  if (!search.value) return;
  loading.value = true;
  try {
    const vinylResults = await searchVinyls(search.value);
    results.value = vinylResults.map(v => ({
      discogsId: v.discogsId,
      album: v.title,
      artist: v.discColor,
      imageUrl: v.imageUrl,
    })) as Vinyl[];
  } finally {
    loading.value = false;
  }
}

const onSearch = () => {
  if (search.value) {
    searchAlbum();
    router.replace(`/catalog/add?search=${search.value}`)
  } else {
    results.value = [];
    router.replace('/catalog/add')
  }
}

onMounted(() => searchAlbum());

</script>

<template>
  <div class="action-bar">
    <input
      class="album-search"
      v-model="search"
      type="text"
      placeholder="Search for albums..."
      @change="onSearch"
    />
    <button class="search-button" @click="onSearch()">
      <img class="icon" src="../assets/icons/search.png" />
    </button>
  </div>
  <div v-if="loading" class="loading">Searching...</div>
  <div v-if="!results.length" class="loading">Add New Records to Crate</div>
  <VinylList v-else :vinyls="results" @add="selectVinyl" @vinylSelect="selectVinyl" />
</template>

<style scoped>
  .search-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }

  .back-button {
    width: 36px;
    height: 36px;
    margin: 0;
    margin-bottom: 8px;
    padding: 0;
    background: none;
  }

  .back-button img {
    width: 24px;
    margin-top: 5px;
  }

  .action-bar {
    display: flex;
    align-items: center;
  }

  .album-search {
    margin: 8px 0;
    width: calc(100% - 16px);
    padding: 8px 16px;
    font-size: 16px;
    border-radius: 20px;
    border: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    background-color: hsl(27, 15%, 19%);
  }

  .search-button {
    width: 50px;
    height: 40px;
    padding: 8px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .loading {
    padding: 32px 0;
    text-align: center;
    color: #b3b3b3;
  }
</style>
