window.onload = function() {
    const container = document.getElementById('form-container');
    const today = new Date().toISOString().split('T')[0];

    container.innerHTML = `
        <div class="card elden-card p-4 p-md-5" style="max-width: 600px; width: 100%;">
            <div class="card-body">
                <h1 class="elden-title text-center h2 mb-3">Boss Legyőzési Napló</h1>
                <hr class="elden-divider mb-4">
                
                <form id="bossForm" novalidate>
                    <!-- 1. Karakter neve -->
                    <div class="mb-3">
                        <label for="playerName" class="form-label elden-label">Játékos / Karakter neve (3-20)</label>
                        <input type="text" class="form-control elden-input" id="playerName" placeholder="pl. Tarnished One">
                    </div>

                    <!-- 2. Boss választó -->
                    <div class="mb-3">
                        <label for="bossName" class="form-label elden-label">Legyőzött Boss</label>
                        <select class="form-select elden-input" id="bossName">
                            <option value="">-- Válassz Boss-t --</option>
                            <option value="Margit, the Fell Omen">Margit, the Fell Omen</option>
                            <option value="Godrick the Grafted">Godrick the Grafted</option>
                            <option value="Starscourge Radahn">Starscourge Radahn</option>
                            <option value="Malenia, Blade of Miquella">Malenia, Blade of Miquella</option>
                            <option value="Bayle the Dread">Bayle the Dread</option>
                        </select>
                    </div>

                    <!-- 3. Próbálkozások -->
                    <div class="mb-3">
                        <label for="attempts" class="form-label elden-label">Próbálkozások száma (1-999)</label>
                        <input type="number" class="form-control elden-input" id="attempts" min="1" max="999" placeholder="pl. 12">
                    </div>

                    <!-- 4. Dátum -->
                    <div class="mb-3">
                        <label for="victoryDate" class="form-label elden-label">Győzelem dátuma</label>
                        <input type="date" class="form-control elden-input" id="victoryDate" min="2022-02-25" max="${today}">
                    </div>

                    <!-- 5. Nehézség -->
                    <div class="mb-3">
                        <label for="difficulty" class="form-label elden-label">Nehézségi értékelés (1-10)</label>
                        <input type="number" class="form-control elden-input" id="difficulty" min="1" max="10" placeholder="10 = Malenia level">
                    </div>

                    <!-- 6. Idézés (Summon) -->
                    <div class="mb-4">
                        <label class="form-label elden-label d-block">Használtál idézést (Summon)?</label>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="summonYes" name="summon" value="Igen">
                            <label class="form-check-label text-light" for="summonYes">Igen</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="summonNo" name="summon" value="Nem">
                            <label class="form-check-label text-light" for="summonNo">Nem</label>
                        </div>
                    </div>

                    <!-- Hibaüzenetek hűen elhelyezve -->
                    <div id="error-messages" class="alert alert-danger d-none mb-3" role="alert"></div>

                    <button type="submit" class="btn btn-elden w-100 py-3 text-uppercase">Győzelem Naplózása</button>
                </form>
            </div>
        </div>
    `;

    function enforceMinMax(inputElement, min, max) {
        inputElement.addEventListener('input', function() {
            let value = parseInt(this.value);
            if (value > max) this.value = max;
            else if (value < min && this.value !== '') this.value = min;
        });
    }
    enforceMinMax(document.getElementById('attempts'), 1, 999);
    enforceMinMax(document.getElementById('difficulty'), 1, 10);

    const form = document.getElementById('bossForm');
    const errorDiv = document.getElementById('error-messages');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        errorDiv.classList.add('d-none');
        errorDiv.innerHTML = '';

        const playerName = document.getElementById('playerName').value.trim();
        const bossName = document.getElementById('bossName').value;
        const attempts = parseInt(document.getElementById('attempts').value);
        const victoryDate = document.getElementById('victoryDate').value;
        const difficulty = parseInt(document.getElementById('difficulty').value);
        const summonElement = document.querySelector('input[name="summon"]:checked');
        const summon = summonElement ? summonElement.value : null;

        let errors = [];

        if (!playerName || playerName.length < 3 || playerName.length > 20) {
            errors.push("• A játékos nevének 3 és 20 karakter között kell lennie!");
        }

        if (!bossName) {
            errors.push("• Kérlek válassz ki egy Boss-t!");
        }

        if (isNaN(attempts) || attempts < 1 || attempts > 999) {
            errors.push("• A próbálkozások száma 1 és 999 között lehet!");
        }

        if (!victoryDate) {
            errors.push("• Kérlek add meg a győzelem dátumát!");
        } else if (victoryDate < "2022-02-25" || victoryDate > today) {
            errors.push(`• A dátumnak 2022-02-25 és ${today} között kell lennie!`);
        }

        if (isNaN(difficulty) || difficulty < 1 || difficulty > 10) {
            errors.push("• A nehézségi értékelésnek 1 és 10 között kell lennie!");
        }

        if (!summon) {
            errors.push("• Kérlek válaszd ki, hogy használtál-e idézést!");
        }

        if (errors.length > 0) {
            errorDiv.innerHTML = errors.join("<br>");
            errorDiv.classList.remove('d-none');
            return;
        }

        const formData = {
            playerName: playerName,
            bossName: bossName,
            attempts: attempts,
            victoryDate: victoryDate,
            difficulty: difficulty,
            summon: summon
        };

        localStorage.setItem('eldenBossData', JSON.stringify(formData));
        window.location.href = 'eredmeny.html';
    });
};