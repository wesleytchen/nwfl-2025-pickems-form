document.addEventListener('DOMContentLoaded', () => {
    const teams = [
        { seed: 1, name: 'Gatekeepers' },
        { seed: 2, name: 'Steamers' },
        { seed: 3, name: 'Gulls' },
        { seed: 4, name: 'Sockeyes' },
        { seed: 5, name: 'Founders' },
        { seed: 6, name: 'Windjammers' },
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
        return teams.find(t => t.seed === seed);
    }

    function render() {
        renderBracket();
        renderForm();
    }

    function renderBracket() {
        // Quarterfinal teams
        const qf1_teams = [getTeamBySeed(4), getTeamBySeed(5)];
        const qf2_teams = [getTeamBySeed(3), getTeamBySeed(6)];

        // Semifinal teams
        const sf1_t1 = getTeamBySeed(1);
        const sf1_t2 = picks.quarterfinals.match1 ? getTeamBySeed(picks.quarterfinals.match1) : { name: 'TBD' };
        const sf2_t1 = getTeamBySeed(2);
        const sf2_t2 = picks.quarterfinals.match2 ? getTeamBySeed(picks.quarterfinals.match2) : { name: 'TBD' };

        // Championship teams
        const champ_t1 = picks.semifinals.match1 ? getTeamBySeed(picks.semifinals.match1) : { name: 'TBD' };
        const champ_t2 = picks.semifinals.match2 ? getTeamBySeed(picks.semifinals.match2) : { name: 'TBD' };

        // Champion
        const champion = picks.championship.match1 ? getTeamBySeed(picks.championship.match1) : { name: 'TBD' };

        bracketContainer.innerHTML = `
            <div class="round quarterfinals">
                <div class="matchup">
                    <div class="team ${picks.quarterfinals.match1 === qf1_teams[0].seed ? 'winner' : ''}">${qf1_teams[0].name} (4)</div>
                    <div class="team ${picks.quarterfinals.match1 === qf1_teams[1].seed ? 'winner' : ''}">${qf1_teams[1].name} (5)</div>
                </div>
                <div class="matchup">
                    <div class="team ${picks.quarterfinals.match2 === qf2_teams[0].seed ? 'winner' : ''}">${qf2_teams[0].name} (3)</div>
                    <div class="team ${picks.quarterfinals.match2 === qf2_teams[1].seed ? 'winner' : ''}">${qf2_teams[1].name} (6)</div>
                </div>
            </div>
            <div class="round semifinals">
                <div class="matchup">
                    <div class="team ${picks.semifinals.match1 === sf1_t1.seed ? 'winner' : ''}">${sf1_t1.name} (1)</div>
                    <div class="team ${picks.semifinals.match1 === sf1_t2.seed ? 'winner' : ''}">${sf1_t2.name} ${sf1_t2.seed ? `(${sf1_t2.seed})` : ''}</div>
                </div>
                <div class="matchup">
                    <div class="team ${picks.semifinals.match2 === sf2_t1.seed ? 'winner' : ''}">${sf2_t1.name} (2)</div>
                    <div class="team ${picks.semifinals.match2 === sf2_t2.seed ? 'winner' : ''}">${sf2_t2.name} ${sf2_t2.seed ? `(${sf2_t2.seed})` : ''}</div>
                </div>
            </div>
            <div class="round championship">
                <div class="matchup">
                    <div class="team ${picks.championship.match1 === champ_t1.seed ? 'winner' : ''}">${champ_t1.name} ${champ_t1.seed ? `(${champ_t1.seed})` : ''}</div>
                    <div class="team ${picks.championship.match1 === champ_t2.seed ? 'winner' : ''}">${champ_t2.name} ${champ_t2.seed ? `(${champ_t2.seed})` : ''}</div>
                </div>
            </div>
            <div class="round winner">
                 <div class="matchup">
                    <div class="team champion">${champion.name} ${champion.seed ? `(${champion.seed})` : ''}</div>
                </div>
            </div>
        `;
    }

    function renderForm() {
        const qf1_winner = picks.quarterfinals.match1 ? getTeamBySeed(picks.quarterfinals.match1) : { name: 'Winner of QF1' };
        const qf2_winner = picks.quarterfinals.match2 ? getTeamBySeed(picks.quarterfinals.match2) : { name: 'Winner of QF2' };

        const sf1_winner = picks.semifinals.match1 ? getTeamBySeed(picks.semifinals.match1) : { name: 'Winner of SF1' };
        const sf2_winner = picks.semifinals.match2 ? getTeamBySeed(picks.semifinals.match2) : { name: 'Winner of SF2' };

        const champ_t1 = picks.semifinals.match1 ? getTeamBySeed(picks.semifinals.match1) : { name: 'Team A' };
        const champ_t2 = picks.semifinals.match2 ? getTeamBySeed(picks.semifinals.match2) : { name: 'Team B' };


        const formRounds = `
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

            <div class="form-round">
                <h3>Semifinals</h3>
                <div class="form-matchup">
                    <label>Matchup: ${getTeamBySeed(1).name} (1) vs ${qf1_winner.name}</label>
                    <select name="sf_match1" data-round="semifinals" data-match="match1" ${!picks.quarterfinals.match1 ? 'disabled' : ''}>
                        <option value="">Select a winner</option>
                        <option value="1" ${picks.semifinals.match1 === 1 ? 'selected' : ''}>${getTeamBySeed(1).name}</option>
                        ${picks.quarterfinals.match1 ? `<option value="${qf1_winner.seed}" ${picks.semifinals.match1 === qf1_winner.seed ? 'selected' : ''}>${qf1_winner.name}</option>` : ''}
                    </select>
                </div>
                <div class="form-matchup">
                    <label>Matchup: ${getTeamBySeed(2).name} (2) vs ${qf2_winner.name}</label>
                    <select name="sf_match2" data-round="semifinals" data-match="match2" ${!picks.quarterfinals.match2 ? 'disabled' : ''}>
                        <option value="">Select a winner</option>
                        <option value="2" ${picks.semifinals.match2 === 2 ? 'selected' : ''}>${getTeamBySeed(2).name}</option>
                        ${picks.quarterfinals.match2 ? `<option value="${qf2_winner.seed}" ${picks.semifinals.match2 === qf2_winner.seed ? 'selected' : ''}>${qf2_winner.name}</option>` : ''}
                    </select>
                </div>
            </div>

            <div class="form-round">
                <h3>Championship</h3>
                <div class="form-matchup">
                    <label>Matchup: ${sf1_winner.name} vs ${sf2_winner.name}</label>
                    <select name="champ_match1" data-round="championship" data-match="match1" ${!picks.semifinals.match1 || !picks.semifinals.match2 ? 'disabled' : ''}>
                        <option value="">Select a winner</option>
                        ${picks.semifinals.match1 ? `<option value="${sf1_winner.seed}" ${picks.championship.match1 === sf1_winner.seed ? 'selected' : ''}>${sf1_winner.name}</option>` : ''}
                        ${picks.semifinals.match2 ? `<option value="${sf2_winner.seed}" ${picks.championship.match1 === sf2_winner.seed ? 'selected' : ''}>${sf2_winner.name}</option>` : ''}
                    </select>
                </div>
            </div>
        `;

        const tiebreakerDiv = form.querySelector('.tiebreaker');
        const submitButton = form.querySelector('button[type="submit"]');

        form.innerHTML = '';
        form.insertAdjacentHTML('beforeend', formRounds);
        form.appendChild(tiebreakerDiv);
        form.appendChild(submitButton);


        document.getElementById('tiebreaker-team1-label').innerText = champ_t1.name;
        document.getElementById('tiebreaker-team2-label').innerText = champ_t2.name;
    }

    form.addEventListener('change', (e) => {
        if (e.target.tagName === 'SELECT') {
            const round = e.target.dataset.round;
            const match = e.target.dataset.match;
            const winnerSeed = e.target.value ? parseInt(e.target.value) : null;

            if (picks[round][match] === winnerSeed) return;

            picks[round][match] = winnerSeed;

            // Clear subsequent picks to ensure data integrity
            switch (round) {
                case 'quarterfinals':
                    picks.semifinals.match1 = null;
                    picks.semifinals.match2 = null;
                    picks.championship.match1 = null;
                    break;
                case 'semifinals':
                    picks.championship.match1 = null;
                    break;
            }

            // If a quarterfinal match is cleared, we may need to clear a specific semifinal
            if(round === 'quarterfinals' && match === 'match1') {
                picks.semifinals.match1 = null;
            }
            if(round === 'quarterfinals' && match === 'match2') {
                picks.semifinals.match2 = null;
            }


            render();
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // This is where you would handle the form submission,
        // for example, by sending the data to a Google Form.
        console.log('Form Submitted', picks);
        alert('Picks submitted! Check the console for the data.');
    });

    render();
});
