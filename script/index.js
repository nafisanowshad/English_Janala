const loadLessons = () => {
    const url = 'https://openapi.programming-hero.com/api/levels/all'

    fetch(url)
        .then(res => res.json())
        .then(json => {

            setLessonData(json.data)
        })
}
loadLessons()

const spinnerLoading = (status) => {
    const spinnerDiv = document.getElementById('spinner')
    const wordContainer = document.getElementById('wordContainer')
    if (status == true) {
        spinnerDiv.classList.remove('hidden')
        wordContainer.classList.add('invisible')
    } else {
        wordContainer.classList.remove('invisible')
        spinnerDiv.classList.add('hidden')
    }
}

const setLessonData = (lessions) => {
    const lessionDiv = document.getElementById('lessions')
    lessionDiv.innerHTML = ''
    lessions.forEach(lesson => {
        const btnDiv = document.createElement('div')
        btnDiv.innerHTML = `
                             <button id="lesson-btn-${lesson.level_no}" onclick = "loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary btn-active-remove">
                            <i class="fa-solid fa-book-open"></i>
                            Learn- ${lesson.level_no} </button>
        `
        lessionDiv.append(btnDiv)
    });
}
const removeActive = () => {
    const getButton = document.querySelectorAll(".btn-active-remove")

    getButton.forEach(btn => {
        btn.classList.remove('active')
    })


}

const loadLevelWord = (id) => {
    spinnerLoading(true)
    const wordContainer = document.getElementById('wordContainer')
    wordContainer.innerHTML = ''
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
        .then(res => res.json())
        .then(json => {
            removeActive()
            const activeBtn = document.getElementById(`lesson-btn-${id}`)
            activeBtn.classList.add('active')
            console.log(activeBtn);
            displayLevelWord(json.data)
            spinnerLoading(false)
        })

}

const loadWordDetails = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    const res = await fetch(url)
    const details = await res.json()
    displayWordDetails(details.data)
}

const synonymsFunction = (words) => {
    const synonyms = words.map(word => `<span class="px-3 py-1 text-sm bg-gray-100 border border-gray-200 rounded-md"> ${word} </span>`)
    console.log(synonyms);
    return synonyms.join(' ')

}

const displayWordDetails = (details) => {
    const detailDiv = document.getElementById('details')
    const modalSection = document.getElementById('my_modal_5')
    const { word, meaning, pronunciation, sentence, partsOfSpeech, synonyms } = details
    detailDiv.innerHTML = `
     <div class="bg-white w-[420px] rounded-xl border border-gray-200 p-6">

    <!-- Title -->
    <h2 class="text-xl font-semibold text-gray-800 mb-4">
      ${word} /<i class="fa-solid fa-microphone-lines"></i> : ( ${pronunciation} )
    </h2>

    <!-- Meaning -->
    <div class="mb-4">
      <h3 class="font-semibold text-gray-700 mb-1">Meaning</h3>
      <p class="text-gray-600">${meaning}</p>
    </div>

    <!-- Example -->
    <div class="mb-4">
      <h3 class="font-semibold text-gray-700 mb-1">Example</h3>
      <p class="text-gray-600">
        ${sentence}
      </p>
    </div>

    <!-- Synonyms -->
    <div class="mb-6">
      <h3 class="font-semibold text-gray-700 mb-2">সমার্থক শব্দ গুলো</h3>
      <div class="flex gap-2 flex-wrap">
          ${synonymsFunction(synonyms)}
      </div>
    </div>
    <div class = "my-5"> 
    <h3 class="font-semibold text-gray-700 mb-2">Parts of Speech</h3>
    <p class="px-3 py-1 text-sm bg-gray-100 border border-gray-200 rounded-md">
 ${partsOfSpeech}
        </p> 
        </div>

    <!-- Button -->
    <button class="w-full bg-primary hover:brightness-80 text-white py-2 rounded-lg transition">
      Complete Learning
    </button>

  </div>
    `
    modalSection.showModal()



}

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
}

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById('wordContainer')
    wordContainer.innerHTML = ''
    const count = document.getElementById('count')
    count.innerText = words.length
    if (words.length === 0) {
        wordContainer.innerHTML = `
        <div class="text-center col-span-full space-y-5 hind-siliguri-bangla lg:py-16">
        <i class="fa-solid fa-triangle-exclamation text-6xl text-black/50 "></i>
            <p class="text-2xl font-bold text-black/50 ">এই lesson এ এখনও কোনো Vocabulary যুক্ত করা হয়নি</p>
            <p class="text-4xl font-bold text-black/80"> অন্য একটি Lesson Select করুন।</p>
        </div>`
        spinnerLoading(false)
        return
    }
    words.forEach(word => {
        const wordDiv = document.createElement('div')
        wordDiv.innerHTML = `
         <div class="p-2 h-full">
            <div class="flex flex-col gap-5 justify-between h-full w-full max-w-lg  bg-white  rounded-sm shadow-sm p-4 ">
                <div class="text-center space-y-5 ">
                    <h1 class="text-xl font-bold text-black ">${word.word ? word.word : 'Word পাওয়া যায়নি'} </h1>

                    <p class="text-sm font-medium text-black "> Meaning / Pronounciation</p>

                    <p class="text-xl  text-center font-semibold text-gray-700">
                        ${word.meaning ? word.meaning : 'meaning পাওয়া যায়নি'} / ${word.pronunciation ? word.pronunciation : 'pronunciation পাওয়া যায়নি'}
                    </p>
                </div>

                <div class="flex justify-between">
                    <button
                     onclick= loadWordDetails(${word.id})
                        class="  cursor-pointer bg-sky-50 hover:bg-sky-200 transition duration-300 rounded-sm p-2">
                        <i class="fa-solid fa-circle-info"></i>
                    </button>

                    <button
                    onclick =" pronounceWord('${word.word}')"
                        class=" cursor-pointer bg-sky-50 hover:bg-sky-200 transition duration-300 rounded-sm p-2">
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                </div>

            </div>
        </div>
        `
        wordContainer.append(wordDiv)
    })
    spinnerLoading(false)
}


document.getElementById('searchBtn')
    .addEventListener('click', () => {
        const input = document.getElementById('inputSearch')
        const inputValues = input.value.toLowerCase()
        fetch('https://openapi.programming-hero.com/api/words/all')
            .then(res => res.json())
            .then(data => {
                const allWords = data.data
                const filterWord = allWords.filter(word => word.word.toLowerCase().includes(inputValues))
                displayLevelWord(filterWord)


            })

    })