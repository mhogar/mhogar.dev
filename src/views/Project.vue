<template>
  <div class="project">
    <div class="container">
      <div class="row">
        <div class="col col-md-5">
          <h1 class="title">Cube Robots... In Space!!!</h1>
          <p class="lead">
            Created for the GMTK Game Jam 2021, this game was made in 48 hours including all code, graphics, and sound effects. It placed 921st out of the 5800 total entries.
          </p>
          <div class="button-links">
            <a class="btn btn-lg btn-primary" href="#" target="_blank">Play on Itch.io</a>
            <a class="btn btn-lg btn-primary" href="#" target="_blank">Play on Itch.io</a>
          </div>
        </div>
        <div class="col col-md-7">
          <img class="thumbnail" width="720" src="https://cdn.mhogar.dev/mhogar_dev/portfolio/thumbnails/cube_robots.png" />
        </div>
      </div>
      <hr />
      <div class="info-grid">
        <div class="row d-flex justify-content-center header">
          <div class="col-md-2">
            Category
            <p><span class="badge rounded-pill">Games</span></p>
          </div>
          <div class="col-md-2">
            Status
            <p><span class="badge rounded-pill">Released</span></p>
          </div>
          <div class="col-md-2">
            Initial Release Date
            <p><span class="badge rounded-pill">June 2021</span></p>
          </div>
          <div class="col-md-2">
            Current Version
            <p><span class="badge rounded-pill">1.0.0</span></p>
          </div>
        </div>
      </div>
      <hr />
    </div>
  </div>
</template>

<style lang="scss" scoped>

@import "../assets/theme.scss";

.project {
  padding-bottom: 1rem;
}

.thumbnail {
  margin: 1rem;
  border-radius: .5em;
}

.title {
  padding-top: 3rem;
  font-size: 3.5rem;
}

.button-links .btn {
  margin-right: 1rem;
}

.info-grid {
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

.info-grid .header {
  margin-bottom: 0.5rem;
}

.mode-light {
  .badge {
    background-color: $light;
  }
}

.mode-dark {
  .badge {
    background-color: $dark;
  }
}

</style>
