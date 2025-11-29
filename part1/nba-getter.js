
async function getNbaStandings() {
    const nbaTable = document.querySelector('.nba-table');
    if (!nbaTable) {
        console.error('nba-table element not found');
        return;
    }

    try {
        const response = await fetch('nba_standings.json');
        if (!response.ok) {
            throw new Error(`nba_standings.json 파일을 찾을 수 없습니다. (HTTP ${response.status})`);
        }
        const data = await response.json();

        // The team array is nested under result.seasonTeamStats
        if (data && data.result && Array.isArray(data.result.seasonTeamStats)) {
            const allTeams = data.result.seasonTeamStats;
            const westernTeams = allTeams
                .filter(team => team.conf === 'WESTERN')
                .sort((a, b) => a.rank - b.rank);

            if (westernTeams.length > 0) {
                nbaTable.innerHTML = ''; // Clear existing list
                westernTeams.forEach(team => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${team.rank}. ${team.teamName} - ${team.wins}승 ${team.losses}패`;
                    nbaTable.appendChild(listItem);
                });
            } else {
                nbaTable.innerHTML = '<li>json 파일에서 서부 콘퍼런스 팀을 찾을 수 없습니다.</li>';
            }
        } else {
            nbaTable.innerHTML = '<li>json 파일의 형식이 예상과 다릅니다. (result.seasonTeamStats 배열을 찾을 수 없음)</li>';
        }
    } catch (error) {
        console.error('Error processing NBA standings from JSON:', error);
        if (nbaTable) {
            nbaTable.innerHTML = '<li>데이터를 불러오는 중 오류가 발생했습니다.</li>';
        }
    }
}

document.addEventListener('DOMContentLoaded', getNbaStandings);
