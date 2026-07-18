<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import VinylList from '../components/VinylList.vue';
import { getVinyls, searchVinyls } from '../services/vinyls';
import type { Vinyl } from '../types';

const router = useRouter();
const route = useRoute();

const selectVinyl = (vinyl: Vinyl) => {
  router.push(`/crate/add/${vinyl.discogsId}`);
}

const results = ref<Vinyl[]>([]);
const catalogVinyls = ref<Vinyl[]>([]);
const existingVinyls = ref<Vinyl[]>([]);
const loading = ref(false);
const search = ref(route.query?.search as string);

const searchAlbum = async (getCatalog = false) => {
  if (!search.value) return;

  if (getCatalog) catalogVinyls.value = await getVinyls();
  existingVinyls.value = catalogVinyls.value.filter(v => (
      v.album.toLowerCase().includes(search.value.toLowerCase())
      || v.artist.toLowerCase().includes(search.value.toLowerCase())
    ));

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
    router.replace(`/crate/add?search=${search.value}`)
  } else {
    results.value = [];
    router.replace('/crate/add')
  }
}

onMounted(() => searchAlbum(true));

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
  <div v-if="!results.length" class="loading">Add New Records to Crate</div>
  <div v-if="loading" class="loading">Searching...</div>
  <div v-else>
    <div v-if="existingVinyls.length" >
      <h3 class="section-title">Already in Crate</h3>
      <VinylList :vinyls="existingVinyls" />
      <h3 class="section-title">Results</h3>
    </div>
    <VinylList :vinyls="results" @add="selectVinyl" @vinylSelect="selectVinyl" />
  </div>
</template>

<style scoped>
  .search-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }

  .section-title {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-muted);
    margin: 10px 0 0 0;
    font-weight: normal;
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
    background-color: var(--color-tile);
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
    color: var(--color-text);
  }
</style>
