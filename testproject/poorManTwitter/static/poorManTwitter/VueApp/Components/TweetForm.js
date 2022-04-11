app.component('tweet-form', {
  template:
    /*html*/
    `<form class="needs-validation" novalidate="" _lpchecked="1"  @submit.prevent="onSubmit">
      <div class="row g-3">
        <div class="col-md-3">
          <label for="name" class="form-label">Your name</label>
          <input type="text" class="form-control" id="name" placeholder="" required="" maxlength="20" v-model="name">
        </div>

        <div class="col-md-9">
          <label for="text" class="form-label">Your tweet</label>
          <input type="text" class="form-control" id="text" placeholder="" required="" maxlength="50" v-model="text">
        </div>
        <div class="col-md-3">
          <button class="w-20 btn btn-primary btn-lg" type="submit">Tweet!</button>
          <div class="help-block with-errors" v-if="message !== ''">{{message}}</div>
        </div>
      </div>
  </form>`,
  data() {
    return {
      name: '',
      text: '',
      message: '',
    };
  },
  methods: {
    onSubmit() {
      const clearForm = () => {
        this.name = '';
        this.text = '';
      };

      const clearMessage = () => {
        this.message = '';
      };

      const setMessage = (message) => {
        this.message = message;
      };

      if (this.name === '' || this.tweet === '') {
        this.message = 'Tweet is incomplete.';
        return;
      }
      clearMessage();

      // This is requested to be Asyncronous.
      // The JQuery ajax call is async itself.
      // I could have done an async function but I'm not sure that's the request.
      // I used JQuery because of the package contrains defined in the the requirements document.
      $.ajax({
        url: './tweets',
        type: 'POST',
        dataType: 'json',
        data: {
          name: this.name,
          text: this.text,
        },
      })
        .done(function () {
          clearForm();
          setMessage('Tweet submitted');
          setTimeout(clearMessage, 5000);
        })
        .fail(function (xhr, status, errorThrown) {
          console.log('Error: ' + errorThrown);
          console.log('Status: ' + status);
        });
    },
  },
});
