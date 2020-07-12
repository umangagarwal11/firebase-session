
auth.onAuthStateChanged( user => {

  if(user){
    document.querySelector("#content").innerHTML=`
                <form id="add-cafe-form">
                    <input name="name" typ="text" placeholder="Cafe name">
                    <input name="city" typ="text" placeholder="Cafe city">
                    <button >Add Cafe</button>
                </form>

                <ul id="cafe-list"></ul>

                <button id="logout">Logout</button>`
    const cafes=document.querySelector("#cafe-list");



    //Reading data
    // db.collection("cafes").get().then(snapshot => {
    //   snapshot.docs.forEach(doc => {
    //     render(doc);
    //   });
    //
    // });

    function render(doc){
      let li = document.createElement('li');
      let name = document.createElement('span');
      let city = document.createElement('span');
      let cross = document.createElement('div');

      li.setAttribute('data-id',doc.id);
      name.textContent= doc.data().name;
      city.textContent= doc.data().city;
      cross.textContent= 'x';

      li.appendChild(name);
      li.appendChild(city);
      li.appendChild(cross);

      cafes.appendChild(li);
      //deleting data
      cross.addEventListener('click', (e) =>{
        let id= e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
      });
    }


    //saving data
    const form= document.querySelector("#add-cafe-form")

    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      db.collection('cafes').add({
        name:form.name.value,
        city:form.city.value,
      }).then(() => {
        form.reset();
      });
    });

    //updating all values
    //db.collection("cafes").doc(document-id).set({....});

    //updating only mentioned attr
    //db.collection("cafes").doc(document-id).update({....});

    //real-time updates
    db.collection("cafes").orderBy('name').onSnapshot(snapshot => {
      let changes= snapshot.docChanges();
      changes.forEach(change => {
        if(change.type == 'added'){
          render(change.doc);
        }else if (change.type == 'removed') {
          let id= cafes.querySelector('[data-id='+ change.doc.id +']');
          cafes.removeChild(id);
        }
      })
    });

    const logout= document.querySelector('#logout');
    logout.addEventListener('click', (e) => {
      e.preventDefault();
      auth.signOut();
    });

  } else {
    document.querySelector("#content").innerHTML=`
    <form id="signup-form">
      <div class="input-field">
        <input type="email" id="signup-email" placeholder="Email" required />
      </div>
      <div class="input-field">
        <input type="password" placeholder="Choose password" id="signup-password" required />
      </div>

      <button class="btn yellow darken-2 z-depth-0">Sign up</button>
    </form>
    <HR>
    <form id="login-form">
      <div class="input-field">
        <input type="email" placeholder="Email" id="login-email" required />

      </div>
      <div class="input-field">
        <input type="password" id="login-password" placeholder="Pass" required />
      </div>
      <button class="btn yellow darken-2 z-depth-0">Login</button>
    </form>`;

    //Authentication

    //login
    const loginform= document.querySelector('#login-form');

    loginform.addEventListener('submit', (e) => {
      e.preventDefault();

      const email= loginform['login-email'].value;
      const password= loginform['login-password'].value;

      auth.signInWithEmailAndPassword(email,password).then( cred => {

        console.log(cred.user);
        loginform.reset();
      });
    });


    //signup
    const signupform= document.querySelector('#signup-form');

    signupform.addEventListener('submit', (e) => {
      e.preventDefault();

      const email= signupform['signup-email'].value;
      const password= signupform['signup-password'].value;

      auth.createUserWithEmailAndPassword(email,password).then(cred => {
        signupform.reset();
      });

    });

  }

});
