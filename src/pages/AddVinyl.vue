<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import VinylDetails from '../components/VinylDetails.vue';
import * as service from '../services/vinyls';
import type { Vinyl } from '../types';
import { AxiosError } from 'axios';

const route = useRoute();
const router = useRouter();
const vinylId = route.params.id as string;

const vinyl = ref<Vinyl>();

const getDiscogsVinyl = async (id: string) => {
  try {
    vinyl.value = await service.getDiscogsVinyl(id);
  } catch (e) {
    console.error(e);
  }
}
watch(() => vinylId, getDiscogsVinyl);
onMounted(() => getDiscogsVinyl(vinylId));

const onAddVinyl = async () => {
  if (!vinyl.value) return;

  try {
    const res = await service.createVinyl(vinyl.value.id);
    router.push(res.data.id ? `/${res.data.id}` : '/');
  } catch (e) {
    console.error(e);
    if (e instanceof AxiosError) {
      if (e.response?.status === 403) {
        alert('You have reached your vinyl limit. Please complete sign up to add more vinyls.');
      } else {
        alert('An error occurred while adding the vinyl. Please try again.');
      }
    }
  }
}

</script>

<template>
  <VinylDetails :vinyl="vinyl" :on-add="onAddVinyl" />
</template>

<style scoped>
</style>
