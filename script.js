document.addEventListener('DOMContentLoaded', () => {
    const teams = [
        { seed: 1, name: 'Gatekeepers', icon: 'https://via.placeholder.com/32/0000FF/FFFFFF?text=G' },
        { seed: 2, name: 'Steamers', icon: 'https://via.placeholder.com/32/FF0000/FFFFFF?text=S' },
        { seed: 3, name: 'Gulls', icon: 'https://via.placeholder.com/32/008000/FFFFFF?text=G' },
        { seed: 4, name: 'Sockeyes', icon: 'https://via.placeholder.com/32/FFFF00/000000?text=S' },
        { seed: 5, name: 'Founders', icon: 'https://via.placeholder.com/32/FFA500/FFFFFF?text=F' },
        { seed: 6, name: 'Windjammers', icon: 'https://via.placeholder.com/32/800080/FFFFFF?text=W' },
    ];

    const bracketContainer = document.querySelector('.bracket-container');
    const form = document.getElementById('pickems-form');

    let picks = {
        quarterfinals: {
            match1: null, // 4 vs 5
            match2: null, // 3 vs 6
        },
        semifinals: {
            match1: null, // 1 vs winner of QF1
            match2: null, // 2 vs winner of QF2
        },
        championship: {
            match1: null, // winner of SF1 vs winner of SF2
        },
    };

    function getTeamBySeed(seed) {
        if (!seed) return { name: 'TBD', icon: 'https://via.placeholder.com/32/EEEEEE/AAAAAA?text=?' };
        return teams.find(t => t.seed === seed);
    }

    function render() {
        renderBracket();
        renderForm();
    }
    
    function renderTeam(team, winnerSeed) {
        const isWinner = team.seed && team.seed === winnerSeed;
        return `
            <div class="team ${isWinner ? 'winner' : ''}">
                <img src="${team.icon}" alt="${team.name} icon" class="team-icon">
                <span class="team-name">${team.name} ${team.seed ? `(${team.seed})` : ''}</span>
            </div>
        `;
    }

    function renderBracket() {
        // Quarterfinal teams
        const qf1_t1 = getTeamBySeed(4);
        const qf1_t2 = getTeamBySeed(5);
        const qf2_t1 = getTeamBySeed(3);
        const qf2_t2 = getTeamBySeed(6);

        // Semifinal teams
        const sf1_t1 = getTeamBySeed(1);
        const sf1_t2 = getTeamBySeed(picks.quarterfinals.match1);
        const sf2_t1 = getTeamBySeed(2);
        const sf2_t2 = getTeamBySeed(picks.quarterfinals.match2);

        // Championship teams
        const champ_t1 = getTeamBySeed(picks.semifinals.match1);
        const champ_t2 = getTeamBySeed(picks.semifinals.match2);

        // Champion
        const champion = getTeamBySeed(picks.championship.match1);

        bracketContainer.innerHTML = `
            <div class="round quarterfinals">
                <div class="matchup">
                    ${renderTeam(qf1_t1, picks.quarterfinals.match1)}
                    ${renderTeam(qf1_t2, picks.quarterfinals.match1)}
                </div>
                <div class="matchup">
                    ${renderTeam(qf2_t1, picks.quarterfinals.match2)}
                    ${renderTeam(qf2_t2, picks.quarterfinals.match2)}
                </div>
            </div>
            <div class="round semifinals">
                <div class="matchup">
                    ${renderTeam(sf1_t1, picks.semifinals.match1)}
                    ${renderTeam(sf1_t2, picks.semifinals.match1)}
                </div>
                <div class="matchup">
                    ${renderTeam(sf2_t1, picks.semifinals.match2)}
                    ${renderTeam(sf2_t2, picks.semifinals.match2)}
                </div>
            </div>
            <div class="round championship">
                <div class="matchup">
                    ${renderTeam(champ_t1, picks.championship.match1)}
                    ${renderTeam(champ_t2, picks.championship.match1)}
                </div>
            </div>
            <div class="round winner">
                 <div class="matchup">
                    <div class="team champion">
                        <img src="${champion.icon}" alt="${champion.name} icon" class="team-icon">
                        <span class="team-name">${champion.name} ${champion.seed ? `(${champion.seed})` : ''}</span>
                    </div>
                </div>
            </div>
        `;
    }

    function renderForm() {
        let formContent = '';

        // Always render Quarterfinals
        formContent += `
            <div class="form-round">
                <h3>Quarterfinals</h3>
                <div class="form-matchup">
                    <label>Matchup: ${getTeamBySeed(4).name} (4) vs ${getTeamBySeed(5).name} (5)</label>
                    <select name="qf_match1" data-round="quarterfinals" data-match="match1">
                        <option value="">Select a winner</option>
                        <option value="4" ${picks.quarterfinals.match1 === 4 ? 'selected' : ''}>${getTeamBySeed(4).name}</option>
                        <option value="5" ${picks.quarterfinals.match1 === 5 ? 'selected' : ''}>${getTeamBySeed(5).name}</option>
                    </select>
                </div>
                <div class="form-matchup">
                    <label>Matchup: ${getTeamBySeed(3).name} (3) vs ${getTeamBySeed(6).name} (6)</label>
                    <select name="qf_match2" data-round="quarterfinals" data-match="match2">
                        <option value="">Select a winner</option>
                        <option value="3" ${picks.quarterfinals.match2 === 3 ? 'selected' : ''}>${getTeamBySeed(3).name}</option>
                        <option value="6" ${picks.quarterfinals.match2 === 6 ? 'selected' : ''}>${getTeamBySeed(6).name}</option>
                    </select>
                </div>
            </div>
        `;

        // Render Semifinals if Quarterfinals are complete
        if (picks.quarterfinals.match1 && picks.quarterfinals.match2) {
            const qf1_winner = getTeamBySeed(picks.quarterfinals.match1);
            const qf2_winner = getTeamBySeed(picks.quarterfinals.match2);
            formContent += `
                <div class="form-round">
                    <h3>Semifinals</h3>
                    <div class="form-matchup">
                        <label>Matchup: ${getTeamBySeed(1).name} (1) vs ${qf1_winner.name}</label>
                        <select name="sf_match1" data-round="semifinals" data-match="match1">
                            <option value="">Select a winner</option>
                            <option value="1" ${picks.semifinals.match1 === 1 ? 'selected' : ''}>${getTeamBySeed(1).name}</option>
                            <option value="${qf1_winner.seed}" ${picks.semifinals.match1 === qf1_winner.seed ? 'selected' : ''}>${qf1_winner.name}</option>
                        </select>
                    </div>
                    <div class="form-matchup">
                        <label>Matchup: ${getTeamBySeed(2).name} (2) vs ${qf2_winner.name}</label>
                        <select name="sf_match2" data-round="semifinals" data-match="match2">
                            <option value="">Select a winner</option>
                            <option value="2" ${picks.semifinals.match2 === 2 ? 'selected' : ''}>${getTeamBySeed(2).name}</option>
                            <option value="${qf2_winner.seed}" ${picks.semifinals.match2 === qf2_winner.seed ? 'selected' : ''}>${qf2_winner.name}</option>
                        </select>
                    </div>
                </div>
            `;
        }

        // Render Championship if Semifinals are complete
        if (picks.semifinals.match1 && picks.semifinals.match2) {
            const sf1_winner = getTeamBySeed(picks.semifinals.match1);
            const sf2_winner = getTeamBySeed(picks.semifinals.match2);
            formContent += `
                <div class="form-round">
                    <h3>Championship</h3>
                    <div class="form-matchup">
                        <label>Matchup: ${sf1_winner.name} vs ${sf2_winner.name}</label>
                        <select name="champ_match1" data-round="championship" data-match="match1">
                            <option value="">Select a winner</option>
                            <option value="${sf1_winner.seed}" ${picks.championship.match1 === sf1_winner.seed ? 'selected' : ''}>${sf1_winner.name}</option>
                            <option value="${sf2_winner.seed}" ${picks.championship.match1 === sf2_winner.seed ? 'selected' : ''}>${sf2_winner.name}</option>
                        </select>
                    </div>
                </div>
            `;
        }

        form.innerHTML = formContent; // Set the content for the rounds

        // Render Tiebreaker and Submit button if championship pick is made
        if (picks.championship.match1) {
            const champ_t1 = getTeamBySeed(picks.semifinals.match1);
            const champ_t2 = getTeamBySeed(picks.semifinals.match2);
            
            const tiebreakerHTML = `
                <div class="tiebreaker">
                    <h3>Tiebreaker</h3>
                    <p>Predict the final score of the championship game.</p>
                    <div class="tiebreaker-inputs">
                        <div>
                            <label id="tiebreaker-team1-label" for="team1-score">
                                <img src="${champ_t1.icon}" class="team-icon"> ${champ_t1.name}
                            </label>
                            <input type="number" id="team1-score" name="tiebreaker_team1_score" min="0">
                        </div>
                        <div>
                            <label id="tiebreaker-team2-label" for="team2-score">
                                <img src="${champ_t2.icon}" class="team-icon"> ${champ_t2.name}
                            </label>
                            <input type="number" id="team2-score" name="tiebreaker_team2_score" min="0">
                        </div>
                    </div>
                </div>
                <button type="submit">Submit Picks</button>
            `;
            form.insertAdjacentHTML('beforeend', tiebreakerHTML);
        }
    }

    form.addEventListener('change', (e) => {
        if (e.target.tagName === 'SELECT') {
            const round = e.target.dataset.round;
            const match = e.target.dataset.match;
            const winnerSeed = e.target.value ? parseInt(e.target.value) : null;

            if (picks[round][match] === winnerSeed) return;

            picks[round][match] = winnerSeed;

            // Clear subsequent picks to ensure data integrity
            if (round === 'quarterfinals') {
                if (match === 'match1') {
                    picks.semifinals.match1 = null;
                }
                if (match === 'match2') {
                    picks.semifinals.match2 = null;
                }
                picks.championship.match1 = null;
            } else if (round === 'semifinals') {
                picks.championship.match1 = null;
            }

            render();
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const finalPicks = {
            ...picks,
            tiebreaker: {
                team1_score: document.getElementById('team1-score').value,
                team2_score: document.getElementById('team2-score').value,
            }
        }
        // This is where you would handle the form submission,
        // for example, by sending the data to a Google Form.
        console.log('Form Submitted', finalPicks);
        alert('Picks submitted! Check the console for the data.');
    });

    render();
});

