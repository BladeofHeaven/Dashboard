async function getData(url = './../data.json') {
  const response = await fetch(url);
  const data = await response.json();

  return data;
}

class dashboardItem {

  static PERIODS = {
    daily: 'day',
    weekly: 'week',
    monthly: 'month',
  }

  constructor(data, container = '.content', view = 'weekly') {
    this.data = data;
    this.container = document.querySelector(container);
    this.view = view;

    this._creatingMarkup();
  }

  _creatingMarkup() {
    const {title, timeframes} = this.data;
    const {current, previous} = timeframes[this.view.toLowerCase()];

    const id = title.toLowerCase().replace(/ /g, '-');

    this.container.insertAdjacentHTML('beforeend', `
      <div class="dashboard__item dashboard__item--${id}">
        <article class="tracking-card">
          <header class="tracking-card__header">
            <h4 class="tracking-card__title">
              ${title}
            </h4>
            <img class="tracking-card__menu" src="./images/icon-ellipsis.svg" alt="menu">
          </header>
          <div class="tracking-card__body">
            <div class="tracking-card__time">
              ${current}hrs
            </div>
            <div class="tracking-card__prev-time">
              Last ${dashboardItem.PERIODS[this.view]} - ${previous}hrs
            </div>
          </div>
        </article>
      </div>
    `);

    this.time = this.container.querySelector(`.dashboard__item--${id} .tracking-card__time`);
    this.prev = this.container.querySelector(`.dashboard__item--${id} .tracking-card__prev-time`);
  }

  changeView(view) {
    this.view = view.toLowerCase();

    const {title, timeframes} = this.data;
    const {current, previous} = timeframes[this.view.toLowerCase()];

    this.time.innerText = `${current}hrs`
    this.prev.innerText = `Last ${dashboardItem.PERIODS[this.view]} - ${previous}hrs`
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getData()
    .then((data) => {
      const activities = data.map((activity) => new dashboardItem(activity));

      const selectors = document.querySelectorAll('.time__units-link');
      selectors.forEach((selector) => {
        selector.addEventListener('click', (e) => {
          e.preventDefault();
          selectors.forEach((sel) => sel.classList.remove('time__units-link--active'));
          selector.classList.add('time__units-link--active');

          const curView = selector.innerText.trim().toLowerCase();
          activities.forEach((activity) => activity.changeView(curView))
        })
      })
    })
})