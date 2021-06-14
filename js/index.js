// JavaScript Document
$(document).ready(function () {
    var grid = 3;

    var o_win = 0;
    var x_win = 0;
    var turn = 'o';

    function generateWinningConditons(grid) {
        var conditions = [];

        var diagonal1 = [];
        var diagonal2 = [];

        for(i=0; i<grid; ++i) {
            var horizontal = [];
            var vertical = [];

            for(j=0; j<grid; ++j) {
                horizontal.push([i, j]);
                vertical.push([j, i]);

                if(i === j) {
                    diagonal1.push([i, j]);
                }

                if(i + j === (grid - 1)) {
                    diagonal2.push([i, j]);
                }
            }

            conditions.push(horizontal);
            conditions.push(vertical);
        }

        conditions.push(diagonal1);
        conditions.push(diagonal2);

        return conditions;
    }

    function generateColumns(x, grid) {
        return new Array(grid).fill(undefined).map((val, index) => {
            return `<li class="btn span1" data-x=${x} data-y=${index}>+</li>`;
        }).join('');
    }

    function generateRows(grid) {
        return new Array(grid).fill(undefined).map((val, index) => {
            var columns = generateColumns(index, grid);

            return `<div class="row">${columns}</div>`
        }).join('');
    }

    function evaluateTieConditions(grid, turn, winningConditons) {
        var positions = [];

        $(`.${turn}`).each(function(index){
            var position = [
                $(this).data('x'),
                $(this).data('y')
            ];

            positions.push(position);
        });

        $(`.${turn}`).each(function(index){
            var position = [
                $(this).data('x'),
                $(this).data('y')
            ];

            positions.push(position);
        });

        $('#game li:not(".disable")').each(function(index){
            var position = [
                $(this).data('x'),
                $(this).data('y')
            ];

            positions.push(position);
        });

        var winningPosition = winningConditons.filter(winningConditon => {
            var intersect = winningConditon.filter(coords => {
                return positions.some(position => {
                    return position[0] === coords[0] && position[1] === coords[1];
                })
            });

            return intersect.length === grid;
        });

        return winningPosition.length === 0;
    }

    function evaluateWinningConditions(grid, turn, winningConditons) {
        var total = $(`.${turn}`).length;
        var oppositeTurn = turn === 'x' ? 'o' : 'x';

        if(total < grid) {
            // Impossible to win
            return;
        }

        var positions = [];

        $(`.${turn}`).each(function(index){
            var position = [
                $(this).data('x'),
                $(this).data('y')
            ];

            positions.push(position);
        });

        var winningPosition = winningConditons.filter(winningConditon => {
            var intersect = winningConditon.filter(coords => {
                return positions.some(position => {
                    return position[0] === coords[0] && position[1] === coords[1];
                })
            });

            return intersect.length === grid;
        });

        return winningPosition.length > 0;
    }

    function restart() {
        $("#game li").text("+");
        $("#game li").removeClass('disable')
        $("#game li").removeClass('o')
        $("#game li").removeClass('x')
        $("#game li").removeClass('btn-primary')
        $("#game li").removeClass('btn-info')

        turn = 'o';
    }

    var rows = generateRows(grid);
    var winningConditons = generateWinningConditons(grid);

    $('#grid').val(grid);
    $('#game').append(rows);

    $('#grid').change(function(){
        grid = parseInt($(this).val());

        rows = generateRows(grid);
        winningConditons = generateWinningConditons(grid);

        $('#game').html(rows);

        restart();
    });

    $('#game').on('click', 'li', function () {
        if($(this).hasClass('disable')) {
            alert('Already selected');

            return;
        }

        var oppositeTurn = turn === 'x' ? 'o' : 'x';

        if(turn === 'x') {
            $(this).addClass('x disable btn-info');
            $(this).text('X');
        } else {
            $(this).addClass('o disable btn-primary');
            $(this).text('O');
        }

        var isWinning = evaluateWinningConditions(grid, turn, winningConditons);

        if(isWinning) {
            alert(`${turn.toUpperCase()} wins`);

            if(turn === 'x') {
                ++x_win;
                $('#x_win').text(x_win)
            } else {
                ++o_win;
                $('#o_win').text(o_win)
            }

            restart();

            return;
        }

        var isTie = evaluateTieConditions(grid, oppositeTurn, winningConditons);

        if(isTie) {
            alert('Its a tie. It will restart.')

            restart();

            return;
        }

        turn = turn === 'x' ? 'o' : 'x';
    });

    
    $("#reset").click(function () {
        restart();
    });
});
