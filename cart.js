<<<<<<< HEAD
// sprawdzamy czy koszyk juz istnieje, jesli nie to tworzymy pusty
if (!localStorage.getItem('koszyk')) {
    localStorage.setItem('koszyk', JSON.stringify([]));
}

// liczymy ile jest produktow w koszyku
function aktualizujLicznik() {
    // pobieramy koszyk z pamieci
    let koszyk = JSON.parse(localStorage.getItem('koszyk'));
    // znajdujemy licznik na stronie
    let licznik = document.getElementById('licznik-koszyka');
    
    if (licznik) {
        // liczymy wszystkie produkty
        let ile = 0;
        for (let i = 0; i < koszyk.length; i++) {
            ile = ile + koszyk[i].ilosc;
        }
        // pokazujemy liczbe na stronie
        licznik.textContent = ile;
    }
}

// dodajemy produkt do koszyka
function dodajDoKoszyka(e) {
    // zatrzymujemy domyslne dzialanie przycisku
    if (e) {
        e.preventDefault();
    }
    
    // znajdujemy klikniety produkt
    let przycisk = e.target;
    let produkt = przycisk.closest('.produkt');
    let nazwa = produkt.querySelector('h3').textContent;
    let cena = produkt.querySelector('p').textContent;
    let obraz = produkt.querySelector('.domyslny-obraz').src;

    // tworzymy nowy produkt do koszyka
    let przedmiot = {
        nazwa: nazwa,
        cena: cena,
        obraz: obraz,
        ilosc: 1
    };

    // pobieramy koszyk z pamieci
    let koszyk = JSON.parse(localStorage.getItem('koszyk'));
    
    // sprawdzamy czy produkt juz jest w koszyku
    let znaleziono = false;
    for (let i = 0; i < koszyk.length; i++) {
        if (koszyk[i].nazwa === przedmiot.nazwa) {
            // jesli jest to zwiekszamy ilosc
            koszyk[i].ilosc = koszyk[i].ilosc + 1;
            znaleziono = true;
            break;
        }
    }
    
    // jesli nie ma to dodajemy
    if (!znaleziono) {
        koszyk.push(przedmiot);
    }
    
    // zapisujemy koszyk
    localStorage.setItem('koszyk', JSON.stringify(koszyk));
    aktualizujLicznik();

    // pokazujemy wiadomosc
    let wiadomosc = document.createElement('div');
    wiadomosc.className = 'wiadomosc-sukcesu';
    wiadomosc.textContent = 'produkt dodany do koszyka!';
    document.body.appendChild(wiadomosc);

    // usuwamy wiadomosc po 2 sekundach
    setTimeout(function() {
        if (wiadomosc.parentNode) {
            wiadomosc.parentNode.removeChild(wiadomosc);
        }
    }, 2000);
}

// usuwamy produkt z koszyka
function usunZKoszyka(indeks) {
    // pobieramy koszyk
    let koszyk = JSON.parse(localStorage.getItem('koszyk'));
    
    // tworzymy nowy koszyk bez usuwanego produktu
    let nowyKoszyk = [];
    for (let i = 0; i < koszyk.length; i++) {
        if (i !== indeks) {
            nowyKoszyk.push(koszyk[i]);
        }
    }
    
    // zapisujemy nowy koszyk
    localStorage.setItem('koszyk', JSON.stringify(nowyKoszyk));
    aktualizujLicznik();
    pokazKoszyk();
    
    // sprawdzamy czy koszyk jest pusty
    if (nowyKoszyk.length === 0) {
        let licznik = document.getElementById('licznik-koszyka');
        if (licznik) {
            licznik.textContent = '0';
        }
    }
}

// zmieniamy ilosc produktu
function zmienIlosc(indeks, zmiana) {
    // pobieramy koszyk
    let koszyk = JSON.parse(localStorage.getItem('koszyk'));
    
    // zmieniamy ilosc
    koszyk[indeks].ilosc = koszyk[indeks].ilosc + zmiana;
    
    // ilosc nie moze byc mniejsza niz 1
    if (koszyk[indeks].ilosc < 1) {
        koszyk[indeks].ilosc = 1;
    }
    
    // zapisujemy koszyk
    localStorage.setItem('koszyk', JSON.stringify(koszyk));
    pokazKoszyk();
}

// liczymy ile kosztuje wszystko w koszyku
function obliczSume() {
    // pobieramy koszyk
    let koszyk = JSON.parse(localStorage.getItem('koszyk'));
    
    // liczymy sume
    let suma = 0;
    for (let i = 0; i < koszyk.length; i++) {
        // zamieniamy tekst na liczbe
        let cenaTekst = koszyk[i].cena.replace('zł', '').trim();
        let cena = parseFloat(cenaTekst);
        suma = suma + (cena * koszyk[i].ilosc);
    }
    
    return suma;
}

// pokazujemy zawartosc koszyka na stronie
function pokazKoszyk() {
    // znajdujemy miejsce na produkty
    let kontenerKoszyka = document.getElementById('elementy-koszyka');
    if (!kontenerKoszyka) return;

    // pobieramy koszyk
    let koszyk = JSON.parse(localStorage.getItem('koszyk'));
    
    // czyscimy kontener
    kontenerKoszyka.innerHTML = '';

    // pokazujemy sume
    let elementSumy = document.getElementById('suma-koszyka');
    if (elementSumy) {
        elementSumy.textContent = 'Suma: ' + obliczSume().toFixed(2) + ' zł';
    }

    // jesli koszyk jest pusty
    if (koszyk.length === 0) {
        kontenerKoszyka.innerHTML = '<p class="pusty-koszyk">Twój koszyk jest pusty</p>';
        if (elementSumy) {
            elementSumy.textContent = 'Suma: 0.00 zł';
        }
        return;
    }

    // dodajemy produkty do koszyka
    for (let i = 0; i < koszyk.length; i++) {
        let elementKoszyka = document.createElement('div');
        elementKoszyka.className = 'element-koszyka';
        
        // tworzymy html dla produktu
        elementKoszyka.innerHTML = `
            <img src="${koszyk[i].obraz}" alt="${koszyk[i].nazwa}" class="obraz-elementu-koszyka">
            <div class="szczegoly-elementu-koszyka">
                <h3>${koszyk[i].nazwa}</h3>
                <p>${koszyk[i].cena}</p>
                <div class="kontrolki-ilosci">
                    <button onclick="zmienIlosc(${i}, -1)">-</button>
                    <span>${koszyk[i].ilosc}</span>
                    <button onclick="zmienIlosc(${i}, 1)">+</button>
                </div>
            </div>
            <button class="przycisk-usun" onclick="usunZKoszyka(${i})">×</button>
        `;
        
        // dodajemy produkt do koszyka
        kontenerKoszyka.appendChild(elementKoszyka);
    }
}

// przygotowujemy dane zamowienia do wyslania przez formsubmit
function przygotujDaneZamowienia() {
    // pobieramy koszyk
    let koszyk = JSON.parse(localStorage.getItem('koszyk'));
    
    // przygotowujemy informacje o produktach
    let produktyInfo = [];
    let sumaZamowienia = 0;
    
    // zbieramy dane o produktach
    for (let i = 0; i < koszyk.length; i++) {
        let cenaTekst = koszyk[i].cena.replace('zł', '').trim();
        let cena = parseFloat(cenaTekst);
        let wartoscProduktu = cena * koszyk[i].ilosc;
        sumaZamowienia += wartoscProduktu;
        
        produktyInfo.push({
            nazwa: koszyk[i].nazwa,
            cena: koszyk[i].cena,
            ilosc: koszyk[i].ilosc,
            wartosc: wartoscProduktu.toFixed(2) + ' zł'
        });
    }
    
    // tworzymy obiekt z danymi zamowienia
    let zamowienie = {
        produkty: produktyInfo,
        suma: sumaZamowienia.toFixed(2) + ' zł'
    };
    
    // zapisujemy dane zamowienia do ukrytego pola formularza
    document.getElementById('zamowienie-dane').value = JSON.stringify(zamowienie);
    
    // czyscimy koszyk po wyslaniu formularza
    setTimeout(function() {
        localStorage.setItem('koszyk', JSON.stringify([]));
        aktualizujLicznik();
        alert('Dziękujemy za zamówienie! Wkrótce się z Tobą skontaktujemy.');
    }, 1000);
}

// uruchamiamy gdy strona sie zaladuje
window.onload = function() {
    // aktualizujemy licznik koszyka
    aktualizujLicznik();
    
    // pokazujemy koszyk na stronie koszyka
    if (window.location.href.indexOf('basket.html') > -1) {
        pokazKoszyk();
    }
};

=======
// sprawdzamy czy koszyk juz istnieje, jesli nie to tworzymy pusty
if (!localStorage.getItem('koszyk')) {
    localStorage.setItem('koszyk', JSON.stringify([]));
}

// liczymy ile jest produktow w koszyku
function aktualizujLicznik() {
    // pobieramy koszyk z pamieci
    let koszyk = JSON.parse(localStorage.getItem('koszyk'));
    // znajdujemy licznik na stronie
    let licznik = document.getElementById('licznik-koszyka');
    
    if (licznik) {
        // liczymy wszystkie produkty
        let ile = 0;
        for (let i = 0; i < koszyk.length; i++) {
            ile = ile + koszyk[i].ilosc;
        }
        // pokazujemy liczbe na stronie
        licznik.textContent = ile;
    }
}

// dodajemy produkt do koszyka
function dodajDoKoszyka(e) {
    // zatrzymujemy domyslne dzialanie przycisku
    if (e) {
        e.preventDefault();
    }
    
    // znajdujemy klikniety produkt
    let przycisk = e.target;
    let produkt = przycisk.closest('.produkt');
    let nazwa = produkt.querySelector('h3').textContent;
    let cena = produkt.querySelector('p').textContent;
    let obraz = produkt.querySelector('.domyslny-obraz').src;

    // tworzymy nowy produkt do koszyka
    let przedmiot = {
        nazwa: nazwa,
        cena: cena,
        obraz: obraz,
        ilosc: 1
    };

    // pobieramy koszyk z pamieci
    let koszyk = JSON.parse(localStorage.getItem('koszyk'));
    
    // sprawdzamy czy produkt juz jest w koszyku
    let znaleziono = false;
    for (let i = 0; i < koszyk.length; i++) {
        if (koszyk[i].nazwa === przedmiot.nazwa) {
            // jesli jest to zwiekszamy ilosc
            koszyk[i].ilosc = koszyk[i].ilosc + 1;
            znaleziono = true;
            break;
        }
    }
    
    // jesli nie ma to dodajemy
    if (!znaleziono) {
        koszyk.push(przedmiot);
    }
    
    // zapisujemy koszyk
    localStorage.setItem('koszyk', JSON.stringify(koszyk));
    aktualizujLicznik();

    // pokazujemy wiadomosc
    let wiadomosc = document.createElement('div');
    wiadomosc.className = 'wiadomosc-sukcesu';
    wiadomosc.textContent = 'produkt dodany do koszyka!';
    document.body.appendChild(wiadomosc);

    // usuwamy wiadomosc po 2 sekundach
    setTimeout(function() {
        if (wiadomosc.parentNode) {
            wiadomosc.parentNode.removeChild(wiadomosc);
        }
    }, 2000);
}

// usuwamy produkt z koszyka
function usunZKoszyka(indeks) {
    // pobieramy koszyk
    let koszyk = JSON.parse(localStorage.getItem('koszyk'));
    
    // tworzymy nowy koszyk bez usuwanego produktu
    let nowyKoszyk = [];
    for (let i = 0; i < koszyk.length; i++) {
        if (i !== indeks) {
            nowyKoszyk.push(koszyk[i]);
        }
    }
    
    // zapisujemy nowy koszyk
    localStorage.setItem('koszyk', JSON.stringify(nowyKoszyk));
    aktualizujLicznik();
    pokazKoszyk();
    
    // sprawdzamy czy koszyk jest pusty
    if (nowyKoszyk.length === 0) {
        let licznik = document.getElementById('licznik-koszyka');
        if (licznik) {
            licznik.textContent = '0';
        }
    }
}

// zmieniamy ilosc produktu
function zmienIlosc(indeks, zmiana) {
    // pobieramy koszyk
    let koszyk = JSON.parse(localStorage.getItem('koszyk'));
    
    // zmieniamy ilosc
    koszyk[indeks].ilosc = koszyk[indeks].ilosc + zmiana;
    
    // ilosc nie moze byc mniejsza niz 1
    if (koszyk[indeks].ilosc < 1) {
        koszyk[indeks].ilosc = 1;
    }
    
    // zapisujemy koszyk
    localStorage.setItem('koszyk', JSON.stringify(koszyk));
    pokazKoszyk();
}

// liczymy ile kosztuje wszystko w koszyku
function obliczSume() {
    // pobieramy koszyk
    let koszyk = JSON.parse(localStorage.getItem('koszyk'));
    
    // liczymy sume
    let suma = 0;
    for (let i = 0; i < koszyk.length; i++) {
        // zamieniamy tekst na liczbe
        let cenaTekst = koszyk[i].cena.replace('zł', '').trim();
        let cena = parseFloat(cenaTekst);
        suma = suma + (cena * koszyk[i].ilosc);
    }
    
    return suma;
}

// pokazujemy zawartosc koszyka na stronie
function pokazKoszyk() {
    // znajdujemy miejsce na produkty
    let kontenerKoszyka = document.getElementById('elementy-koszyka');
    if (!kontenerKoszyka) return;

    // pobieramy koszyk
    let koszyk = JSON.parse(localStorage.getItem('koszyk'));
    
    // czyscimy kontener
    kontenerKoszyka.innerHTML = '';

    // pokazujemy sume
    let elementSumy = document.getElementById('suma-koszyka');
    if (elementSumy) {
        elementSumy.textContent = 'Suma: ' + obliczSume().toFixed(2) + ' zł';
    }

    // jesli koszyk jest pusty
    if (koszyk.length === 0) {
        kontenerKoszyka.innerHTML = '<p class="pusty-koszyk">Twój koszyk jest pusty</p>';
        if (elementSumy) {
            elementSumy.textContent = 'Suma: 0.00 zł';
        }
        return;
    }

    // dodajemy produkty do koszyka
    for (let i = 0; i < koszyk.length; i++) {
        let elementKoszyka = document.createElement('div');
        elementKoszyka.className = 'element-koszyka';
        
        // tworzymy html dla produktu
        elementKoszyka.innerHTML = `
            <img src="${koszyk[i].obraz}" alt="${koszyk[i].nazwa}" class="obraz-elementu-koszyka">
            <div class="szczegoly-elementu-koszyka">
                <h3>${koszyk[i].nazwa}</h3>
                <p>${koszyk[i].cena}</p>
                <div class="kontrolki-ilosci">
                    <button onclick="zmienIlosc(${i}, -1)">-</button>
                    <span>${koszyk[i].ilosc}</span>
                    <button onclick="zmienIlosc(${i}, 1)">+</button>
                </div>
            </div>
            <button class="przycisk-usun" onclick="usunZKoszyka(${i})">×</button>
        `;
        
        // dodajemy produkt do koszyka
        kontenerKoszyka.appendChild(elementKoszyka);
    }
}

// przygotowujemy dane zamowienia do wyslania przez formsubmit
function przygotujDaneZamowienia() {
    // pobieramy koszyk
    let koszyk = JSON.parse(localStorage.getItem('koszyk'));
    
    // przygotowujemy informacje o produktach
    let produktyInfo = [];
    let sumaZamowienia = 0;
    
    // zbieramy dane o produktach
    for (let i = 0; i < koszyk.length; i++) {
        let cenaTekst = koszyk[i].cena.replace('zł', '').trim();
        let cena = parseFloat(cenaTekst);
        let wartoscProduktu = cena * koszyk[i].ilosc;
        sumaZamowienia += wartoscProduktu;
        
        produktyInfo.push({
            nazwa: koszyk[i].nazwa,
            cena: koszyk[i].cena,
            ilosc: koszyk[i].ilosc,
            wartosc: wartoscProduktu.toFixed(2) + ' zł'
        });
    }
    
    // tworzymy obiekt z danymi zamowienia
    let zamowienie = {
        produkty: produktyInfo,
        suma: sumaZamowienia.toFixed(2) + ' zł'
    };
    
    // zapisujemy dane zamowienia do ukrytego pola formularza
    document.getElementById('zamowienie-dane').value = JSON.stringify(zamowienie);
    
    // czyscimy koszyk po wyslaniu formularza
    setTimeout(function() {
        localStorage.setItem('koszyk', JSON.stringify([]));
        aktualizujLicznik();
        alert('Dziękujemy za zamówienie! Wkrótce się z Tobą skontaktujemy.');
    }, 1000);
}

// uruchamiamy gdy strona sie zaladuje
window.onload = function() {
    // aktualizujemy licznik koszyka
    aktualizujLicznik();
    
    // pokazujemy koszyk na stronie koszyka
    if (window.location.href.indexOf('basket.html') > -1) {
        pokazKoszyk();
    }
};

>>>>>>> 904764b (Initial commit)
    