<template>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">mhogar.dev</router-link>
      <button class="navbar-toggler" type="button"
              data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item">
            <router-link to="/portfolio" class="nav-link">Portfolio</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/blog" class="nav-link">Blog</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <router-view v-slot="{ Component }">
    <transition enter-active-class="animate__animated animate__faster animate__fadeIn"
                leave-active-class="animate__animated animate__faster animate__fadeOut"
                mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <footer class="container footer">
    <p class="float-end"><a href="#">Back to top</a></p>
    <h6>Contact Sources</h6>
    <ul>
      <li>
        <a href="https://www.linkedin.com/in/ryan-stamp-a91020152/">Linked In</a>
      </li>
    </ul>
  </footer>
</template>

<style>

body {
  padding-top: 3rem;
  padding-bottom: 3rem;
  color: #5a5a5a;
}

</style>
