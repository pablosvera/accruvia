app.component('tweet-list', {
  data() {
    return {
      tweets: [],
      timer: null,
    };
  },
  template:
    /*html*/
    `
    <table class="table">
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Tweet</th>
        <th scope="col">Date</th>
      </tr>
    </thead>
    <tbody v-if="tweets.length">
      <tr v-for="(tweet, index) in tweets" :key="index">
        <td>{{tweet.name}}</td>
        <td>{{tweet.text}}</td>
        <td>{{new Date(tweet.date).toLocaleString()}}</td>
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

      $.ajax({
        url: './tweets',
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
  },
  created() {
    this.getTweets();
    this.timer = setInterval(this.getTweets, 3000);
  },
  beforeDestroy() {
    this.cancelAutoUpdate();
  },
});
