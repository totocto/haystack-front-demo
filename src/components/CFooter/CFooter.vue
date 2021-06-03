<template>
  <v-footer padless="true" absolute>
    <v-card flat tile width="100%" class="grey lighten-3 text-center">
      <v-card-text style="display:flex">
        <div class="footer__help">
          <a href="https://github.com/engie-group/shaystack" class="footer__help-links">
            Github Project
          </a>
          <a href="mailto:franck.SEUTIN@engie.com" class="footer__help-links">
            Contact
          </a>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-text class="grey--text">
        <strong>Haystack Version 1.0</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: 'CFooter'
}
</script>

<style lang="scss">
.v-ripple__container {
  opacity: 0.24 !important;
}
.footer__help {
  display: flex;
  flex-direction: column;
  width: 10%;
  justify-content: center;
}
.footer__help-links {
  color: black !important;
}
a {
  outline: none;
  text-decoration: none;
  padding: 2px 1px 0;
}

a:link {
  color: black;
}

a:visited {
  color: grey;
}

a:focus {
  border-bottom: 1px solid;
  background: #bae498;
}

a:hover {
}

a:active {
  background: #265301;
  color: #cdfeaa;
}
</style>
