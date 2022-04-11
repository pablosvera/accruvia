app.component('tweet-list', {
  data() {
    return {
      tweets: [],
      timer: null,
      sort: {},
    };
  },
  template:
    /*html*/
    `
    <table class="table">
    <thead>
      <tr>
        <th scope="col" @click="sortBy('date')" tabindex="0" @keyup.enter="sortBy('date')" @keyup.space="sortBy('date')">
          Time {{sort.date == '' ? '⭡': sort.date == '-' ? '⭣': '↕'}}
        </th>
        <th scope="col">Message</th>
        <th scope="col" @click="sortBy('name')" tabindex="0" @keyup.enter="sortBy('name')" @keyup.space="sortBy('name')">
          Name {{sort.name == '' ? '⭡': sort.name == '-' ? '⭣': '↕'}}
        </th>
      </tr>
    </thead>
    <tbody v-if="tweets.length">
      <tr v-for="(tweet, index) in tweets" :key="index">
        <td>{{new Date(tweet.date).toLocaleString()}}</td>
        <td>{{tweet.text}}</td>
        <td>{{tweet.name}}</td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr> 
        <td colspan="3" class="text-center">No tweets yet</td>
      </tr>
    </tbody>
  </table>
  
  `,
  methods: {
    getTweets() {
      const setTweets = (tweets) => {
        this.tweets = tweets;
      };

      let sortFields = Object.keys(this.sort)
        .map((key) => `${this.sort[key]}${key}`)
        .join('&');
      if (sortFields) {
        sortFields = `sort=${sortFields}`;
      }

      $.ajax({
        url: `./tweets?${sortFields}`,
        type: 'GET',
        dataType: 'json',
      })
        .done(function (json) {
          setTweets(json);
        })
        .fail(function (xhr, status, errorThrown) {
          console.log('Error: ' + errorThrown);
          console.log('Status: ' + status);
        });
    },
    cancelAutoUpdate() {
      clearInterval(this.timer);
    },
    sortBy(field) {
      // if null then set to ascending
      if (this.sort[field] === undefined) {
        this.sort[field] = '';
      }
      // if '' (ascending) then set to descending
      else if (this.sort[field] === '') {
        this.sort[field] = '-';
      }
      // otherwise set to null
      else {
        delete this.sort[field];
      }
      this.getTweets();
    },
  },
  created() {
    this.getTweets();
    this.timer = setInterval(this.getTweets, 5000);
  },
  beforeUnmount() {
    this.cancelAutoUpdate();
  },
  watch: {
    update: function (reload) {
      if (reload) {
        this.getTweets();
      }
    },
  },
});
