<template>
  <div class="player">
    <p>{{ index + 1 }}</p>
    <div class="player__container">
      <div>
        <h2>{{ player.name }}</h2>
        <h2>{{ player.surname[0] }}.</h2>
      </div>
      <h2>{{ player.birthday }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Player',
  props: {
    index: {
      type: Number,
      required: true,
    },
    player: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.player {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: 2px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.158);

  p {
    margin: 0;
    font-size: 15px;
    font-weight: 400;
  }

  &__container {
    display: flex;
    width: 278px;
    justify-content: space-between;

    div {
      display: flex;
      gap: 5px;
    }
  }

  h2 {
    margin: 0;
    font-size: 15px;
    font-weight: 400;
    white-space: nowrap;

    &:last-child {
      padding-right: 40px;
    }
  }
}
</style>
