// Dados dos atletas com os critérios de desempenho
const athletesData = {
    athlete1: {
        name: 'João Silva',
        criteria: {
            'Força': 85,
            'Agilidade': 78,
            'Velocidade': 82,
            'Controle': 88,
            'Comando': 80,
            'Prancha Esquerda': 75,
            'Prancha Direita': 79,
            'Bodydrag': 90,
            'Contra Vento': 83
        }
    },
    athlete2: {
        name: 'Maria Santos',
        criteria: {
            'Força': 92,
            'Agilidade': 88,
            'Velocidade': 90,
            'Controle': 85,
            'Comando': 87,
            'Prancha Esquerda': 89,
            'Prancha Direita': 91,
            'Bodydrag': 86,
            'Contra Vento': 88
        }
    },
    athlete3: {
        name: 'Pedro Costa',
        criteria: {
            'Força': 70,
            'Agilidade': 85,
            'Velocidade': 88,
            'Controle': 72,
            'Comando': 75,
            'Prancha Esquerda': 82,
            'Prancha Direita': 80,
            'Bodydrag': 78,
            'Contra Vento': 76
        }
    }
};

// Inicializar a aplicação quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    const athleteSelect = document.getElementById('athlete-select');
    athleteSelect.addEventListener('change', function() {
        updateDashboard(this.value);
    });

    // Carregar o primeiro atleta por padrão
    updateDashboard('athlete1');
});

// Atualizar o dashboard com os dados do atleta selecionado
function updateDashboard(athleteId) {
    const athlete = athletesData[athleteId];
    
    updateChart(athlete);
    updateCriteriaDetails(athlete);
    updateSummary(athlete);
}

// Atualizar o gráfico radar
function updateChart(athlete) {
    const canvas = document.getElementById('performanceChart');
    const ctx = canvas.getContext('2d');
    
    // Configurar tamanho do canvas
    canvas.width = 500;
    canvas.height = 500;
    
    const labels = Object.keys(athlete.criteria);
    const data = Object.values(athlete.criteria);
    
    // Parâmetros do gráfico
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 80;
    const numPoints = labels.length;
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar círculos concêntricos (grades)
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius / 5) * i, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    // Desenhar linhas radiais
    ctx.strokeStyle = '#e0e0e0';
    for (let i = 0; i < numPoints; i++) {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    
    // Desenhar o polígono de dados
    ctx.fillStyle = 'rgba(79, 172, 254, 0.3)';
    ctx.strokeStyle = 'rgba(79, 172, 254, 1)';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        const value = data[i];
        const distance = (value / 100) * radius;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Desenhar pontos
    ctx.fillStyle = 'rgba(79, 172, 254, 1)';
    for (let i = 0; i < numPoints; i++) {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        const value = data[i];
        const distance = (value / 100) * radius;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Desenhar labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < numPoints; i++) {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        const labelDistance = radius + 35;
        const x = centerX + Math.cos(angle) * labelDistance;
        const y = centerY + Math.sin(angle) * labelDistance;
        
        // Ajustar alinhamento baseado na posição
        if (x < centerX - 5) {
            ctx.textAlign = 'right';
        } else if (x > centerX + 5) {
            ctx.textAlign = 'left';
        } else {
            ctx.textAlign = 'center';
        }
        
        // Dividir labels longos em múltiplas linhas
        const words = labels[i].split(' ');
        if (words.length > 1) {
            ctx.fillText(words[0], x, y - 7);
            ctx.fillText(words[1], x, y + 7);
        } else {
            ctx.fillText(labels[i], x, y);
        }
        
        // Mostrar valor
        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = '#4facfe';
        const valueDistance = (data[i] / 100) * radius;
        const valueX = centerX + Math.cos(angle) * valueDistance;
        const valueY = centerY + Math.sin(angle) * valueDistance;
        ctx.fillText(data[i], valueX, valueY - 10);
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = '#333';
    }
    
    // Título do gráfico
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#333';
    ctx.fillText(athlete.name, centerX, 20);
}

// Atualizar os detalhes dos critérios
function updateCriteriaDetails(athlete) {
    const criteriaGrid = document.getElementById('criteriaGrid');
    criteriaGrid.innerHTML = '';

    for (const [criterion, score] of Object.entries(athlete.criteria)) {
        const card = document.createElement('div');
        card.className = 'criteria-card';
        
        const barFillColor = getColorForScore(score);
        
        card.innerHTML = `
            <h3>${criterion}</h3>
            <div class="criteria-bar">
                <div class="criteria-bar-fill" style="width: ${score}%; background: ${barFillColor};">
                    ${score}
                </div>
            </div>
            <p class="criteria-score">${score}/100</p>
        `;
        
        criteriaGrid.appendChild(card);
    }
}

// Obter cor baseada na pontuação
function getColorForScore(score) {
    if (score >= 85) {
        return 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)';
    } else if (score >= 70) {
        return 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)';
    } else if (score >= 50) {
        return 'linear-gradient(90deg, #fbc531 0%, #f39c12 100%)';
    } else {
        return 'linear-gradient(90deg, #fc4a1a 0%, #f7b733 100%)';
    }
}

// Atualizar o resumo geral
function updateSummary(athlete) {
    const scores = Object.values(athlete.criteria);
    const criteriaNames = Object.keys(athlete.criteria);
    
    // Calcular média
    const average = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
    document.getElementById('averageScore').textContent = average + '/100';
    
    // Encontrar pontos fortes (top 3)
    const sortedCriteria = criteriaNames.map((name, index) => ({
        name: name,
        score: scores[index]
    })).sort((a, b) => b.score - a.score);
    
    const strengths = sortedCriteria.slice(0, 3)
        .map(c => `${c.name} (${c.score})`)
        .join(', ');
    document.getElementById('strengths').textContent = strengths;
    
    // Encontrar pontos a melhorar (bottom 3)
    const weaknesses = sortedCriteria.slice(-3)
        .reverse()
        .map(c => `${c.name} (${c.score})`)
        .join(', ');
    document.getElementById('weaknesses').textContent = weaknesses;
}
