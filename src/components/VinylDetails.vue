<script setup lang="ts">
import { onMounted } from 'vue';
import type { Vinyl } from '../types';

defineProps<{
  vinyl?: Vinyl,
  onPlay?: () => void,
  onAdd?: () => void,
}>()

onMounted(() => window.scrollTo(0, 0));

</script>

<template>
  <section class="vinyl-header" :style="{ background: vinyl?.albumColors?.length ? vinyl.albumColors[0] + '75' : 'var(--color-tile-veil)' }" >
    <img class="vinyl-art" v-if="vinyl?.imageUrl" :src="vinyl?.imageUrl" :alt="vinyl?.album" />
    <div class="vinyl-art" v-else />
    <div class="vinyl-details">
      <h2 v-if="vinyl?.album" class="album">{{ vinyl?.album }}</h2>
      <h2 v-else class="album">Loading...</h2>
      <h3 class="artist">{{ vinyl?.artist }}</h3>
      <div class="published">Released: {{ vinyl?.published }}</div>
      <div v-if="vinyl?.barcode" class="published">Bar Code: {{ vinyl?.barcode }}</div>
      <div class="published">Disk: {{ vinyl?.discColor }}</div>
    </div>
  </section>
  <section class="button-container" :style="{ background: vinyl?.albumColors?.length ? vinyl.albumColors[0] + '75' : 'var(--color-tile-veil)' }" >
    <button
      v-if="onPlay"
      :style="{ background: vinyl?.albumColors?.length ? vinyl.albumColors[0] : 'var(--color-white)' }"
      class="play-button"
      @click="onPlay"
    >
      Play Vinyl
    </button>
    <button
      v-if="onAdd"
      :style="{ background: vinyl?.albumColors?.length ? vinyl.albumColors[0] : 'var(--color-white)' }"
      class="play-button"
      @click="onAdd"
    >
      + Add To Catalog
    </button>
    <hr class="line" :style="{ borderColor: vinyl?.albumColors?.length ? vinyl.albumColors[0] : 'var(--color-white)' }" />
  </section>
  <section>
    <h3 class="subheader">Genres</h3>
    <div class="tags">
      <div v-for="tag in vinyl?.genres">
        <div
          class="tag"
          :style="{ background: vinyl?.albumColors?.length ? vinyl.albumColors[0] : 'var(--color-white)' }"
        >{{ tag }}</div>
      </div>
    </div>
  </section>
  <section>
    <h3 class="subheader">Track List</h3>
    <div class="tracks">
      <div v-for="(track) in vinyl?.tracks">
        <div class="track">
          <span class="track-index" :style="{ borderColor: vinyl?.albumColors?.length ? vinyl.albumColors[0] : 'var(--color-white)', }">
            {{ track.position }}
          </span>
          <span>
            {{ track.title }}
          </span>
        </div>
      </div>
    </div>
  </section>
  <br v-if="onAdd" />
</template>

<style scoped>
  section {
    margin: 0 8px;
    margin-bottom: 16px;
  }

  .vinyl-header {
    display: flex;
    padding: 12px;
    margin: 0;
  }

  .button-container {
    text-align: center;
    position: relative;
    padding-bottom: 8px;
    margin: 0;
    margin-bottom: 12px;
  }

  .line {
    position: absolute;
    margin-top: -30px;
    width: 100%;
    z-index: 1;
  }
  
  .play-button {
    color: var(--color-black);
    font-size: 22px;
    padding: 4px 20px;
    padding-top: 2px;
    font-weight: bold;
    margin: 10px 0;
    z-index: 2;
    position: relative;
    border-radius: 20px;
  }

  .vinyl-art {
    width: 175px;
    height: 175px;
    margin-right: 12px;
  }

  .album, .artist {
    margin: 0;
  }

  .artist {
    margin-bottom: 5px;
  }

  .published {
    color: var(--color-text-muted)
  }

  .tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .subheader {
    margin-top: 0;
    margin-bottom: 4px;
  }

  .tag {
    border: 1px solid var(--color-white);
    font-size: 14px;
    padding: 0 12px;
    border-radius: 16px;
  }

  .track-index {
    display: inline-flex;
    font-size: 12px;
    width: 16px;
    height: 16px;
    padding: 1px;
    margin: 1px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-right: 6px;
    border: 2px solid white;
  }
</style>
