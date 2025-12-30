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

let chart = null;

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
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    const labels = Object.keys(athlete.criteria);
    const data = Object.values(athlete.criteria);

    // Destruir o gráfico anterior se existir
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: athlete.name,
                data: data,
                fill: true,
                backgroundColor: 'rgba(79, 172, 254, 0.2)',
                borderColor: 'rgb(79, 172, 254)',
                pointBackgroundColor: 'rgb(79, 172, 254)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(79, 172, 254)',
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    angleLines: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: {
                        stepSize: 20,
                        font: {
                            size: 12
                        }
                    },
                    pointLabels: {
                        font: {
                            size: 13,
                            weight: 'bold'
                        },
                        color: '#333'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.r + '/100';
                        }
                    }
                }
            }
        }
    });
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
