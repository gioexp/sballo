
import React from 'react';
import { Card, CardContent, Paper, Grid, Typography, IconButton } from '@material-ui/core';
import { EmojiEvents, Close } from '@material-ui/icons';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { toggleScoreboard } from './ScoreboardAction';
import { useStyles } from './ScoreboardCss';
import _ from 'lodash';

function Scoreboard(props) {
    const { id, table, userDetails } = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    const getUserDetailsByUid = (uid) => {
        let userDet = Object.values(userDetails).filter(usr => usr.uid === uid);
        if (userDet.length === 0) return { displayName: 'user' };
        else return userDet[0];
    };

    const calculateRoundPoints = (points, declaration) => {
        if (declaration === -1) return "";
        else {
            let result = 0;
            if (points === declaration) {
                result += 10;
                for (let i = 0; i < points; i++) {
                    result += 2;
                }
            }
            else {
                let penality = Math.abs(points - declaration);
                for (let i = 0; i < penality; i++) {
                    result -= 2;
                }
            }
            if (result === 0) return "";
            let stringResult = result >= 0 ? "+" + result : String(result);
            return stringResult;
        }
    };

    const calculateTotalPoints = (table, uid, pointIndex) => {
        let playerIndex = table.participants.indexOf(uid);
        let result = 0;
        for (let i = 0; i <= pointIndex; i++) {
            if (pointIndex <= table.round) result += Number(calculateRoundPoints(table.points[i][playerIndex], table.declarations[i][playerIndex]));
        }

        if (result === 0 && pointIndex > table.round) return "-";
        let stringResult = result >= 0 ? "+" + result : String(result);
        return stringResult;
    };

    const calculateRanking = (table, uidIndex) => {
        let results = [...Array(table.participants.length).fill(0)];
        for (let i = 0; i < table.participants.length; i++) {
            for (let j = 0; j < table.declarations.length; j++) {
                results[i] += Number(calculateRoundPoints(table.points[j][i], table.declarations[j][i]));
            }
        }
        let myPoints = results[uidIndex];
        results = [...new Set(results)].sort((a, b) => b - a);
        let rank = results.indexOf(myPoints);
        if (rank > 2) rank = -1;
        return rank;
    };

    const getRankingIconcolor = (rank) => {
        switch (rank) {
            case 0:
                return classes.firstRank;
            case 1:
                return classes.secondRank;
            case 2:
                return classes.thirdRank
            default:
                return null;
        }
    };

    const handleCloseScoreboard = (key) => {
        dispatch(toggleScoreboard({ key: key, value: false }));
    };

    function sortParticipantsOnRanking(a, b) {
        let rankA = calculateRanking(table, table.participants.indexOf(a));
        let rankB = calculateRanking(table, table.participants.indexOf(b));
        if (rankA !== -1 && rankB !== -1) return rankA - rankB;
        if (rankA === -1 && rankB !== -1) return 1;
        if (rankA !== -1 && rankB === -1) return -1;
        return 0;
    };

    return (
        <Card className={classes.root}>
            <CardContent>
                {id && table && userDetails &&
                    <div className={classes.gridRoot}>
                        <IconButton color="primary" onClick={() => handleCloseScoreboard(id)} aria-label="close" className={classes.closeButton} disabled={table.scoreBoardOpen}>
                            <Close />
                        </IconButton>
                        <Grid container>
                            <Grid container item >
                                <React.Fragment>
                                    <Grid item className={classes.playerNameItem}>
                                    </Grid>
                                    {table.points.map((point, pointIndex) => (
                                        <Grid key={pointIndex} item className={classes.roundItem}>
                                            <Paper className={classes.roundPaper}>round {pointIndex + 1}</Paper>
                                        </Grid>
                                    ))}
                                </React.Fragment>
                            </Grid>

                            {_.cloneDeep(table.participants).sort(sortParticipantsOnRanking)
                                .map((uid, uidIndex) => (
                                    <Grid key={uid} container className={classes.scoreRow}>
                                        <React.Fragment>
                                            <Grid item className={classes.playerNameItem}>
                                                <Paper className={classes.roundPaper}>{getUserDetailsByUid(uid).displayName}</Paper>
                                            </Grid>
                                            {table.points.map((point, pointIndex) => (
                                                <Grid key={pointIndex} item className={classes.pointItem}>
                                                    <Paper className={classes.pointPaper}>
                                                        <div className={classes.pointPaperSummaryDiv}>
                                                            {table.declarations[pointIndex][table.participants.indexOf(uid)] !== -1 &&
                                                                <Typography variant="caption" className={classes.pointPaperText}>
                                                                    {point[table.participants.indexOf(uid)]}/{table.declarations[pointIndex][table.participants.indexOf(uid)]}
                                                                </Typography>}
                                                        </div>
                                                        <div className={classes.pointPaperRoundPointsDiv}>
                                                            <Typography variant="caption" className={clsx(classes.pointPaperText, calculateRoundPoints(point[table.participants.indexOf(uid)],
                                                                table.declarations[pointIndex][table.participants.indexOf(uid)]).includes("+") ? classes.positiveResult : classes.negativeResult)}>
                                                                {calculateRoundPoints(point[table.participants.indexOf(uid)], table.declarations[pointIndex][table.participants.indexOf(uid)])}
                                                            </Typography>
                                                        </div>
                                                        <div>
                                                            <Typography variant="h6" className={calculateTotalPoints(table, uid, pointIndex).includes("+") ? classes.positiveResult : classes.negativeResult}>
                                                                {calculateTotalPoints(table, uid, pointIndex)}
                                                            </Typography>
                                                        </div>
                                                    </Paper>
                                                </Grid>
                                            ))}
                                            {calculateRanking(table, table.participants.indexOf(uid)) !== -1 &&
                                                <div className={classes.rankIconDiv}>
                                                    <EmojiEvents fontSize="large" className={getRankingIconcolor(calculateRanking(table, table.participants.indexOf(uid)))} />
                                                </div>}
                                        </React.Fragment>
                                    </Grid>
                                ))}
                        </Grid>
                    </div>}
            </CardContent>
        </Card>
    );
}

export default Scoreboard;