<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import VinylDetails from '../components/VinylDetails.vue';
import * as service from '../services/vinyls';
import type { Vinyl } from '../types';

const route = useRoute();
const router = useRouter();
const vinylId = route.params.id as string;

const vinyl = ref<Vinyl>();

const getDiscogsVinyl = async (id: string) => {
  try {
    vinyl.value = await service.getDiscogsVinyl(id);
  } catch (e) {
    console.log(e);
  }
}
watch(() => vinylId, getDiscogsVinyl);
onMounted(() => getDiscogsVinyl(vinylId));

const onAddVinyl = async () => {
  if (!vinyl.value) return;

  try {
    await service.createVinyl(vinyl.value.discogsId);
    router.push('/catalog');
  } catch (e) {
    console.log(e);
  }
}

</script>

<template>
  <VinylDetails :vinyl="vinyl" :on-add="onAddVinyl" />
</template>

<style scoped>
</style>
