<template>
<div class="row my-5">
    <div class="col-md-6 offset-md-3">
        <div class="card">
            <div class="card-body">
                <h3 class="text-center my-4">Signup</h3>
                <div class="form-group">
                    <input v-bind:class="{'is-invalid': errors.name, 'is-valid': !errors.name && this.submitted}" v-model="name" type="text" placeholder="Name" class="form-control">
                    <div class="errors" v-if="errors.name">
                        <small class="text-danger" :key="error" v-for="error in errors.name">{{error}}</small>
                    </div>

                </div>
                <div class="form-group">
                    <input v-bind:class="{'is-invalid': errors.email, 'is-valid': !errors.email && this.submitted}" v-model="email" type="text" placeholder="Email" class="form-control">
                    <div class="errors" v-if="errors.email">
                        <small class="text-danger" :key="error" v-for="error in errors.email">{{error}}</small>
                    </div>
                </div>
                 <div class="form-group">
                    <input v-bind:class="{'is-invalid': errors.password, 'is-valid': !errors.password && this.submitted}" v-model="password" type="password" placeholder="Password" class="form-control">
                    <div class="errors" v-if="errors.password">
                        <small class="text-danger" :key="error" v-for="error in errors.password">{{error}}</small>
                    </div>
                </div>
                 <div class="form-group text-center">
                    <button  @click="registerUser()" :disabled="loading"  class="btn btn-success form-control">
                        <i class="fas fa-spin fa-spinner" v-if="loading"></i>
                        {{ loading ? '' : 'Signup' }}
                    </button>
                </div>
            </div>

        </div>

    </div>
</div>
   
</template>
<script>
import Axios from 'axios';
import config from '@/config'
export default {
    
    beforeRouteEnter (to, from, next) {
        
        //If user is logged in goto Home Page else goto Next() which is Signup 
        if(localStorage.getItem('auth')){

            return next({ path: "/"});

        }

        next();
    },


    data(){
        return {
            name: '',
            email: '',
            password: '',
            errors: {},
            submitted: false,
            loading: false,
        }
    },
    methods: {
        registerUser(){
            this.loading = true;
            Axios.post(`${config.apiUrl}/auth/register`,{
                name: this.name,
                email: this.email,
                password: this.password


            }).then((response) => {
                this.loading = false;
                this.submitted = true;
                const { data } = response.data;
                localStorage.setItem('auth', JSON.stringify(data))
                this.$root.auth = data;

                 // Success notification
                this.$noty.success("Successfully Resgistered.");

                this.$router.push('/');
                 
                //console.log(response)
            }).catch(({ response }) => {
                this.loading = false;

                this.$noty.error("Oops, something went wrong!");

                //console.log(response)
                this.submitted = true;
                this.errors = response.data;  
            })

        }
    },
}
</script>