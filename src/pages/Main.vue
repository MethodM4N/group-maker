<template>
  <section class="main">
    <h1>
      Распределите игроков по командам (перетащите участника в нужную группу), сохранить результат
      можно только после того как в каждой команде будет по 3 участника.
    </h1>

    <div class="main__grid-container">
      <div class="main__players-container">
        <div class="sort">
          <p>№</p>
          <div>
            <button
              @click="() => changeSort('name')"
              class="sort__button sort__button_disabled"
              :class="{ sort__button_activated: this.activeSort === 'name' }"
            >
              Участник
            </button>
            <button
              @click="() => changeSort('birthday')"
              class="sort__button sort__button_disabled"
              :class="{ sort__button_activated: this.activeSort === 'birthday' }"
            >
              Дата рождения
            </button>
          </div>
        </div>

        <draggable class="players" :list="players" group="players">
          <Player
            v-for="(player, index) in players"
            :player="player"
            :index="index"
            :key="player.id"
          />
        </draggable>
      </div>

      <div class="main__group-container">
        <h2 class="main__group-container__text">Группа 1</h2>
        <draggable class="players" :list="firstGroup" group="players">
          <Player
            v-for="(player, index) in firstGroup"
            :player="player"
            :index="index"
            :key="player.id"
          />
        </draggable>
      </div>

      <div class="main__group-container">
        <h2 class="main__group-container__text">Группа 2</h2>
        <draggable class="players" :list="secondGroup" group="players">
          <Player
            v-for="(player, index) in secondGroup"
            :player="player"
            :index="index"
            :key="player.id"
          />
        </draggable>
      </div>

      <div class="main__group-container">
        <h2 class="main__group-container__text">Группа 3</h2>
        <draggable class="players" :list="firthGroup" group="players">
          <Player
            v-for="(player, index) in firthGroup"
            :player="player"
            :index="index"
            :key="player.id"
          />
        </draggable>
      </div>
    </div>

    <button
      @click="onSubmit"
      :disabled="
        this.isSaved ||
        this.firstGroup.length !== 3 ||
        this.secondGroup.length !== 3 ||
        this.firthGroup.length !== 3
      "
      class="main__submit-button"
    >
      Сохранить
    </button>

    <button @click="onClear" class="main__clear-button">Очистить localStorage</button>
  </section>
</template>

<script>
import draggable from 'vuedraggable';

import Player from '@/components/Player.vue';
import initialPlayers from '@/assets/initialPlayers.js';

export default {
  name: 'Main',
  components: {
    Player,
    draggable,
  },
  data() {
    return {
      players: [],
      firstGroup: [],
      secondGroup: [],
      firthGroup: [],
      activeSort: 'name',
      isSaved: false,
      firstMount: true,
    };
  },
  methods: {
    /**
     * Функция изменяет активный параметр сортировки
     * @param {'birthday' | 'name'} sort
     */
    changeSort(sort) {
      this.activeSort = sort;
    },
    /**
     * Функция сабмитит данные (сохраняет их в localStorage), выводит их в консоль лог
     */
    onSubmit() {
      this.isSaved = true;
      const first = this.firstGroup.map((obj) => obj.id);
      const second = this.secondGroup.map((obj) => obj.id);
      const firth = this.firthGroup.map((obj) => obj.id);
      console.log([
        { player_id: first, group_id: '1' },
        { player_id: second, group_id: '2' },
        { player_id: firth, group_id: '3' },
      ]);
      const json = JSON.stringify([...this.firstGroup, ...this.secondGroup, ...this.firthGroup]);
      localStorage.setItem('groups', json);
      this.$dialog.alert('Результат сохранен');
    },
    /**
     * Очищаем localStorage, монтируем начальный список участников
     */
    onClear() {
      localStorage.removeItem('groups');
      this.players = [...initialPlayers];
      this.firstGroup = [];
      this.secondGroup = [];
      this.firthGroup = [];
    },
    /**
     * Проверяем изменения в списках, чтобы управлять сообщением при смене роутера,
     * а также состоянием кнопки "Сохранить"
     */
    checkChanges() {
      if (
        this.firstMount &&
        (this.firstGroup.length == 3 || this.secondGroup.length == 3 || this.firthGroup.length == 3)
      ) {
        this.isSaved = true;
      } else {
        this.isSaved = false;
      }
    },
  },
  mounted() {
    /**
     * Монтируем начальный список участников, сортируем по имени,
     * если в localStorage есть какие либо данные, то берем их
     */
    const data = localStorage.getItem('groups');
    const groups = data ? JSON.parse(data) : null;
    if (groups) {
      this.players = initialPlayers.filter(
        (player1) => !groups.some((player2) => player1.id === player2.id),
      );
      this.firstGroup = groups.splice(0, 3);
      this.secondGroup = groups.splice(0, 3);
      this.firthGroup = groups.splice(0, 3);
    } else {
      const initial = initialPlayers.sort((player1, player2) =>
        player1[this.activeSort]?.localeCompare(player2[this.activeSort]),
      );
      this.players = [...initial];
    }
  },
  watch: {
    /**
     * Следим за изменением категории поиска, сортируем модель участников
     * @param {'birthday' | 'name'} sort
     */
    activeSort(value) {
      if (value === 'birthday') {
        this.players.sort((player1, player2) => player2[value]?.localeCompare(player1[value]));
      } else {
        this.players.sort((player1, player2) => player1[value]?.localeCompare(player2[value]));
      }
    },
    /**
     * Если модели участников были изменены, делаем кнопку активной, запрещаем переход по роуту
     */
    players() {
      this.checkChanges();
    },
    firstGroup() {
      this.checkChanges();
    },
    secondGroup() {
      this.checkChanges();
    },
    firthGroup() {
      this.checkChanges();
      this.firstMount = false;
    },
  },
  beforeRouteLeave(to, from, next) {
    /**
     * Прежде чем совершить переход по роуту, проверяем сохранены ли участники,
     * если нет, спрашиваем хочет ли пользователь покинуть страницу не сохраняя результат
     */
    if (!this.isSaved && this.players.length < 10) {
      this.$dialog
        .confirm('Вы уверены что хотите покинуть страницу? Ваш результат не будет сохранен.')
        .then(function () {
          next();
        })
        .catch(function () {
          next(false);
        });
    } else {
      next();
    }
  },
};
</script>

<style lang="scss">
.main {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h1 {
    margin: 0 auto 10px;
    padding: 0;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
  }

  &__grid-container {
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    column-gap: 10px;

    @media (max-width: 1385px) {
      margin: 0 auto 20px;
      grid-template-columns: 320px 320px;
      gap: 10px;
    }

    @media (max-width: 750px) {
      margin: 0 auto 20px;
      grid-template-columns: 320px;
      gap: 10px;
    }
  }

  &__players-container {
    min-width: 320px;
    padding: 2px;
    min-height: 80px;
    background-color: rgb(241, 241, 241);
    display: flex;
    flex-direction: column;
  }

  &__submit-button {
    margin: 0 auto 10px;
    padding: 10px 40px;
    cursor: pointer;

    &:disabled {
      cursor: unset;
    }
  }

  &__clear-button {
    margin: 0 auto;
    padding: 10px 40px;
    cursor: pointer;

    &:disabled {
      cursor: unset;
    }
  }
}

.sort {
  margin-top: 10px;
  padding: 2px;
  display: flex;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  justify-content: space-between;

  div {
    display: flex;
    width: 282px;
  }

  p {
    margin: 0;
    display: flex;
    align-items: center;
    font-size: 15px;
    font-weight: 400;
  }

  &__button {
    position: relative;
    display: flex;
    border: none;
    background-color: transparent;
    cursor: pointer;
    align-items: center;

    &_disabled {
      &:after {
        content: url(../assets/img/sort-alt.svg);
        position: absolute;
        top: 0;
        right: -20px;
      }
    }

    &_activated {
      &:after {
        content: url(../assets/img/sort-amount.svg);
        position: absolute;
        top: 0;
        right: -20px;
      }
    }

    &:hover {
      opacity: 0.7;
    }
    &:first-of-type {
      margin-right: 80px;
    }

    &:last-of-type {
      margin-right: 20px;
      white-space: nowrap;
    }
  }
}

.players {
  margin-bottom: 4px;
  padding: 2px;
  display: flex;
  flex-direction: column;
  height: 195px;
}

.main__group-container {
  min-width: 320px;
  padding: 2px;
  min-height: 80px;
  background-color: rgb(241, 241, 241);
  display: flex;
  flex-direction: column;

  &__text {
    margin: 0;
    padding: 10px 0;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
  }
}
</style>
