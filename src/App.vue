<template>
  <div id="app">
    
    <Navbar></Navbar>
    <div class="container">
       <!-- route outlet -->
        <!-- component matched by the route will render here -->
      <router-view></router-view>
    </div>
    


  </div>
</template>

<script>
import Navbar from '@/components/Navbar'

export default {
  name: 'app',
  mounted() {
    //this.$router.push('/');
    this.$router.replace('/');
    
  },
  components: {
    
    Navbar,
    
    
  }
}
</script>

<style>
*{
  font-family: 'Poppins', sans-serif;
  border-radius: 0px !important;
}
body{
  background-color: #f5f3ef;
}

</style>
