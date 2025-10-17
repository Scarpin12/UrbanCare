// Menu hamburger
document.addEventListener('DOMContentLoaded', () => {
    const menuHamburger = document.querySelector('.menu_hamburger');
    const menuNavegacao = document.querySelector('.menu_navegacao');
    if (menuHamburger && menuNavegacao) {
        menuHamburger.addEventListener('click', () => {
            menuNavegacao.classList.toggle('active');
        });
    }

    // Animação suave
    const elementos = document.querySelectorAll('.aparecer_suave');
    if (elementos.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visivel');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elementos.forEach(elemento => observer.observe(elemento));
    }

    // Carrossel
    const interiorCarrossel = document.querySelector('.interior_carrossel');
    const botaoAnterior = document.querySelector('.botao_anterior');
    const botaoProximo = document.querySelector('.botao_proximo');
    if (interiorCarrossel && botaoProximo && botaoAnterior) {
        let indiceAtual = 0;
        const itensCarrossel = document.querySelectorAll('.item_carrossel');
        const totalItens = itensCarrossel.length;

        function atualizarCarrossel() {
            const offset = -indiceAtual * 100;
            interiorCarrossel.style.transform = `translateX(${offset}%)`;
        }

        botaoProximo.addEventListener('click', () => {
            indiceAtual = (indiceAtual < totalItens - 1) ? indiceAtual + 1 : 0;
            atualizarCarrossel();
        });

        botaoAnterior.addEventListener('click', () => {
            indiceAtual = (indiceAtual > 0) ? indiceAtual - 1 : totalItens - 1;
            atualizarCarrossel();
        });
    }

    // FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });
    }

    // Modal para imagens
    const imagens = document.querySelectorAll('.objetivo_imagem');
    if (imagens.length > 0) {
        imagens.forEach(imagem => {
            imagem.addEventListener('click', () => {
                const modalId = imagem.getAttribute('data-modal-target');
                const modal = document.querySelector(modalId);
                if (modal) modal.classList.add('active');
            });
        });

        const closeButtons = document.querySelectorAll('.modal-close');
        const modals = document.querySelectorAll('.modal');
        if (closeButtons.length > 0 && modals.length > 0) {
            closeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    modals.forEach(modal => modal.classList.remove('active'));
                });
            });

            window.addEventListener('click', (event) => {
                modals.forEach(modal => {
                    if (event.target === modal) modal.classList.remove('active');
                });
            });
        }
    }

    // Alertas climáticos e mapa
    const carregarAlertas = async () => {
        const apiKey = 'openweathermap'; // Substitua pela sua chave da OpenWeatherMap
        const latitude = -23.5505; // São Paulo, Brasil (ajuste conforme necessário)
        const longitude = -46.6333;
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,daily&appid=${apiKey}`;
        const alertasContainer = document.getElementById('alertas-container');
        const mapaContainer = document.getElementById('mapa');

        if (!mapaContainer || !alertasContainer) return;

        const mapa = L.map('mapa').setView([latitude, longitude], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapa);

        try {
            const response = await fetch(url);
            const data = await response.json();

            alertasContainer.innerHTML = '';
            if (data.alerts && data.alerts.length > 0) {
                data.alerts.forEach(alerta => {
                    const cartao = document.createElement('div');
                    cartao.className = 'cartao';
                    cartao.innerHTML = `
                        <h3>${alerta.event || 'Alerta Climático'}</h3>
                        <p><strong>Descrição:</strong> ${alerta.description || 'Sem descrição disponível'}</p>
                        <p><strong>Início:</strong> ${new Date(alerta.start * 1000).toLocaleString()}</p>
                        <p><strong>Fim:</strong> ${new Date(alerta.end * 1000).toLocaleString()}</p>
                        <p><strong>Gravidade:</strong> ${alerta.severity || 'Não especificada'}</p>
                    `;
                    alertasContainer.appendChild(cartao);

                    L.marker([latitude, longitude]).addTo(mapa)
                        .bindPopup(`<b>${alerta.event}</b><br>${alerta.description || 'Sem detalhes'}`)
                        .openPopup();
                });
            } else {
                const semAlerta = document.createElement('div');
                semAlerta.className = 'cartao';
                semAlerta.innerHTML = '<p>Nenhum alerta climático ativo no momento.</p>';
                alertasContainer.appendChild(semAlerta);
                L.marker([latitude, longitude]).addTo(mapa)
                    .bindPopup('<b>Sem alertas ativos</b>')
                    .openPopup();
            }
        } catch (error) {
            console.error('Erro ao carregar alertas:', error);
            const erro = document.createElement('div');
            erro.className = 'cartao';
            erro.innerHTML = '<p>Erro ao carregar alertas. Verifique a conexão ou a chave API.</p>';
            alertasContainer.appendChild(erro);
            L.marker([latitude, longitude]).addTo(mapa)
                .bindPopup('<b>Erro ao carregar</b>')
                .openPopup();
        }
    };

    if (document.getElementById('alertas_climaticos')) {
        carregarAlertas();
    }

    // Abrigo por Perto
    const locateBtn = document.getElementById('locateBtn');
    const localInfo = document.getElementById('localInfo');
    const directions = document.getElementById('directions');
    const getDirectionsBtn = document.getElementById('getDirectionsBtn');
    if (locateBtn && localInfo && directions && getDirectionsBtn) {
        const shelterName = document.getElementById('shelterName');
        const shelterAddress = document.getElementById('shelterAddress');
        const shelterDistance = document.getElementById('shelterDistance');
        const directionsText = document.getElementById('directionsText');
        const directionsNote = document.getElementById('directionsNote');

        const shelters = [
            { name: "Abrigo Central", lat: -23.5505, lng: -46.6333, address: "Rua Exemplo, 123", distance: "2 km" },
            { name: "Abrigo Norte", lat: -23.5405, lng: -46.6233, address: "Av. Norte, 456", distance: "3 km" }
        ];

        function getDistance(lat1, lng1, lat2, lng2) {
            const R = 6371;
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLng = (lng2 - lng1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLng / 2) * Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return (R * c).toFixed(2);
        }

        function getLocationAbrigo() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLat = position.coords.latitude;
                        const userLng = position.coords.longitude;
                        let closestShelter = shelters[0];
                        let minDistance = getDistance(userLat, userLng, closestShelter.lat, closestShelter.lng);

                        shelters.forEach(shelter => {
                            const distance = getDistance(userLat, userLng, shelter.lat, shelter.lng);
                            if (distance < minDistance) {
                                minDistance = distance;
                                closestShelter = shelter;
                            }
                        });

                        shelterName.textContent = `Nome: ${closestShelter.name}`;
                        shelterAddress.textContent = `Endereço: ${closestShelter.address}`;
                        shelterDistance.textContent = `Distância aproximada: ${closestShelter.distance}`;
                        localInfo.style.display = 'block';
                        directionsText.textContent = `1. Siga pela ${closestShelter.address.split(',')[0]} por 1 km.\n2. Vire à direita na próxima rua principal.`;
                        directionsNote.textContent = `Tempo estimado: ${minDistance < 2 ? '10' : '15'} minutos a pé.`;
                        directions.style.display = 'block';
                    },
                    (error) => {
                        alert("Erro ao obter localização: " + error.message + "\nUsando localização padrão.");
                        const userLat = -23.5505;
                        const userLng = -46.6333;
                        let closestShelter = shelters[0];
                        let minDistance = getDistance(userLat, userLng, closestShelter.lat, closestShelter.lng);

                        shelters.forEach(shelter => {
                            const distance = getDistance(userLat, userLng, shelter.lat, shelter.lng);
                            if (distance < minDistance) {
                                minDistance = distance;
                                closestShelter = shelter;
                            }
                        });

                        shelterName.textContent = `Nome: ${closestShelter.name}`;
                        shelterAddress.textContent = `Endereço: ${closestShelter.address}`;
                        shelterDistance.textContent = `Distância aproximada: ${closestShelter.distance}`;
                        localInfo.style.display = 'block';
                    }
                );
            } else {
                alert("Geolocalização não é suportada por este navegador.");
            }
        }

        locateBtn.addEventListener('click', getLocationAbrigo);
        getDirectionsBtn.addEventListener('click', () => {
            directions.style.display = directions.style.display === 'none' ? 'block' : 'none';
        });
    }

    // Validação do formulário de cadastro
    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const nome = document.getElementById('nome').value.trim();
            const cpf = document.getElementById('cpf').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const alertas = document.querySelectorAll('input[name="alertas"]:checked');

            document.querySelectorAll('.error').forEach(error => error.remove());

            const nomeRegex = /^[A-Za-zÀ-ÿ\s'-]{2,}(?:\s[A-Za-zÀ-ÿ\s'-]{2,})+$/;
            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;

            let isValid = true;

            if (!nome) {
                showError('nome', 'O campo Nome Completo é obrigatório.');
                isValid = false;
            } else if (!nomeRegex.test(nome)) {
                showError('nome', 'Por favor, insira um nome completo válido (mínimo 2 palavras, apenas letras).');
                isValid = false;
            }

            if (!cpf) {
                showError('cpf', 'O campo CPF é obrigatório.');
                isValid = false;
            } else if (!cpfRegex.test(cpf)) {
                showError('cpf', 'Por favor, insira um CPF válido no formato XXX.XXX.XXX-XX.');
                isValid = false;
            }

            if (!email) {
                showError('email', 'O campo E-mail é obrigatório.');
                isValid = false;
            } else if (!emailRegex.test(email)) {
                showError('email', 'Por favor, insira um e-mail válido.');
                isValid = false;
            }

            if (!telefone) {
                showError('telefone', 'O campo Telefone é obrigatório.');
                isValid = false;
            } else if (!telefoneRegex.test(telefone)) {
                showError('telefone', 'Por favor, insira um telefone válido no formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX.');
                isValid = false;
            }

            if (alertas.length === 0) {
                showError('alertas', 'Selecione pelo menos um tipo de alerta.');
                isValid = false;
            }

            if (isValid) {
                alert('Cadastro enviado com sucesso!');
                cadastroForm.reset();
            }
        });

        function showError(fieldId, message) {
            const field = document.getElementById(fieldId);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.style.color = '#D81B60';
            errorDiv.style.fontSize = '0.9rem';
            errorDiv.style.marginTop = '0.5rem';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }
    }
});
