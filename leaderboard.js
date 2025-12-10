document.addEventListener('DOMContentLoaded', () => {
    const teams = [
        { seed: 1, name: 'The Metaverse', icon: 'assets/logan.jpg' },
        { seed: 2, name: 'Tortoise Formation', icon: 'assets/max.jpg' },
        { seed: 3, name: 'Jones March', icon: 'assets/wesley.png' },
        { seed: 4, name: 'Parrot Heads', icon: 'assets/harrison.svg' },
        { seed: 5, name: 'The Winning Team', icon: 'assets/james.svg' },
        { seed: 6, name: 'CertainToExcel', icon: 'assets/theo.jpg' },
    ];

    function getTeamBySeed(seed) {
        if (!seed) return { name: 'TBD', icon: 'assets/placeholder.png' };
        return teams.find(t => t.seed === seed);
    }

    // Mock Master Bracket Data (Actual Results)
    // Update this object as games are played to show the real bracket
    const masterPicks = {
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

    // Mock Leaderboard Data
    const leaderboardData = [
        {
            name: "Maximillian Samengo",
            score: 0,
            picks: {
                quarterfinals: { match1: 5, match2: 6 },
                semifinals: { match1: 1, match2: 2 },
                championship: { match1: 2 }
            },
            tiebreaker: { team1Score: 137, team2Score: 145 }, // team1 is SF1 winner, team2 is SF2 winner
            bonusPrediction: "Josh Allen scores less than 10 points in the final",
            bonusPoints: 5
        },
        {
            name: "Wesley",
            score: 0,
            picks: {
                quarterfinals: { match1: 5, match2: 3 },
                semifinals: { match1: 1, match2: 3 },
                championship: { match1: 3 }
            },
            tiebreaker: { team1Score: 15, team2Score: 800 },
            bonusPrediction: "Josh Allen will throw four interceptions against the Eagles prompting Hailee Steinfeld to file for divorce and move to Kirkland Washington",
            bonusPoints: 505
        },
        {
            name: "Dasha",
            score: 0,
            picks: {
                quarterfinals: { match1: 5, match2: 6 },
                semifinals: { match1: 1, match2: 2 },
                championship: { match1: 2 }
            },
            tiebreaker: { team1Score: 127, team2Score: 138 },
            bonusPrediction: "Dasha’s team stays the toughest. Bowers breaks the record of most points a TE has ever scored. Herbert gets a botched haircut right before the Super Bowl. James Cook gets silly.",
            bonusPoints: 260
        }
    ];

    const container = document.getElementById('leaderboard-container');
    const masterBracketContainer = document.getElementById('master-bracket-container');

    function renderTeam(team, winnerSeed) {
        const isWinner = team.seed && team.seed === winnerSeed;
        return `
            <div class="team ${isWinner ? 'winner' : ''}">
                <img src="${team.icon}" alt="${team.name} icon" class="team-icon">
                <span class="team-name">${team.name} ${team.seed ? `(${team.seed})` : ''}</span>
            </div>
        `;
    }

    function renderMasterBracket() {
        // Quarterfinal teams
        const qf1_t1 = getTeamBySeed(4);
        const qf1_t2 = getTeamBySeed(5);
        const qf2_t1 = getTeamBySeed(3);
        const qf2_t2 = getTeamBySeed(6);

        // Semifinal teams
        const sf1_t1 = getTeamBySeed(1);
        const sf1_t2 = getTeamBySeed(masterPicks.quarterfinals.match1);
        const sf2_t1 = getTeamBySeed(2);
        const sf2_t2 = getTeamBySeed(masterPicks.quarterfinals.match2);

        // Championship teams
        const champ_t1 = getTeamBySeed(masterPicks.semifinals.match1);
        const champ_t2 = getTeamBySeed(masterPicks.semifinals.match2);

        // Champion
        const champion = getTeamBySeed(masterPicks.championship.match1);

        masterBracketContainer.innerHTML = `
        <div class="bracket-scroller">
            <div class="round quarterfinals">
                <div class="matchup">
                    ${renderTeam(qf1_t1, masterPicks.quarterfinals.match1)}
                    ${renderTeam(qf1_t2, masterPicks.quarterfinals.match1)}
                </div>
                <div class="matchup">
                    ${renderTeam(qf2_t1, masterPicks.quarterfinals.match2)}
                    ${renderTeam(qf2_t2, masterPicks.quarterfinals.match2)}
                </div>
            </div>
            <div class="round semifinals">
                <div class="matchup">
                    ${renderTeam(sf1_t1, masterPicks.semifinals.match1)}
                    ${renderTeam(sf1_t2, masterPicks.semifinals.match1)}
                </div>
                <div class="matchup">
                    ${renderTeam(sf2_t1, masterPicks.semifinals.match2)}
                    ${renderTeam(sf2_t2, masterPicks.semifinals.match2)}
                </div>
            </div>
            <div class="round championship">
                <div class="matchup">
                    ${renderTeam(champ_t1, masterPicks.championship.match1)}
                    ${renderTeam(champ_t2, masterPicks.championship.match1)}
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
        </div>
        `;
    }

    function renderLeaderboard() {
        container.innerHTML = '';
        
        if (leaderboardData.length === 0) {
            container.innerHTML = '<p style="text-align: center;">No submissions yet.</p>';
            return;
        }

        const list = document.createElement('div');
        list.className = 'leaderboard-list';

        leaderboardData.forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            
            const header = document.createElement('div');
            header.className = 'leaderboard-header';
            header.innerHTML = `
                <span class="rank">#${index + 1}</span>
                <span class="player-name">${entry.name}</span>
                <span class="player-score">${entry.score} pts</span>
                <span class="toggle-icon">▼</span>
            `;
            
            const details = document.createElement('div');
            details.className = 'leaderboard-details';
            details.style.display = 'none'; // Hidden by default
            
            // Render picks summary
            const qf1 = getTeamBySeed(entry.picks.quarterfinals.match1);
            const qf2 = getTeamBySeed(entry.picks.quarterfinals.match2);
            const sf1 = getTeamBySeed(entry.picks.semifinals.match1);
            const sf2 = getTeamBySeed(entry.picks.semifinals.match2);
            const champ = getTeamBySeed(entry.picks.championship.match1);

            // Determine tiebreaker teams based on Semifinal picks
            const tiebreakerTeam1 = sf1;
            const tiebreakerTeam2 = sf2;

            details.innerHTML = `
                <div class="picks-summary">
                    <div class="pick-round">
                        <strong>Quarterfinals</strong>
                        <div>Winner QF1: <img src="${qf1.icon}" class="mini-icon"> ${qf1.name}</div>
                        <div>Winner QF2: <img src="${qf2.icon}" class="mini-icon"> ${qf2.name}</div>
                    </div>
                    <div class="pick-round">
                        <strong>Semifinals</strong>
                        <div>Winner SF1: <img src="${sf1.icon}" class="mini-icon"> ${sf1.name}</div>
                        <div>Winner SF2: <img src="${sf2.icon}" class="mini-icon"> ${sf2.name}</div>
                    </div>
                    <div class="pick-round">
                        <strong>Champion</strong>
                        <div><img src="${champ.icon}" class="mini-icon"> ${champ.name}</div>
                    </div>
                     <div class="pick-round full-width">
                        <strong>Tiebreaker (Final Score)</strong>
                        <div>
                             <img src="${tiebreakerTeam1.icon}" class="mini-icon"> ${tiebreakerTeam1.name}: ${entry.tiebreaker.team1Score}
                             &nbsp;-&nbsp;
                             <img src="${tiebreakerTeam2.icon}" class="mini-icon"> ${tiebreakerTeam2.name}: ${entry.tiebreaker.team2Score}
                        </div>
                    </div>
                    <div class="pick-round full-width">
                        <strong>Bonus Prediction (${entry.bonusPoints} points)</strong>
                        <div style="font-style: italic;">"${entry.bonusPrediction}"</div>
                    </div>
                </div>
            `;

            header.addEventListener('click', () => {
                const isOpen = details.style.display === 'block';
                details.style.display = isOpen ? 'none' : 'block';
                header.classList.toggle('open', !isOpen);
            });

            item.appendChild(header);
            item.appendChild(details);
            list.appendChild(item);
        });

        container.appendChild(list);
    }

    renderMasterBracket();
    renderLeaderboard();
});