import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import CircularProgress from '@material-ui/core/CircularProgress';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import {
    Button, Avatar, Link,
    Typography, TextField, Grid,
    Paper, Toolbar, AppBar
} from '@material-ui/core';

import * as tf from '@tensorflow/tfjs'

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Made with ❤️ using React and Tensorflow @ '}
            <Link color="inherit" href="https://github.com/ozskywalker/">
                https://github.com/ozskywalker/
            </Link>
        </Typography>
    );
}

const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    stepper: {
        padding: theme.spacing(3, 0, 5),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
});

class App extends React.Component {
    state = { isTfReady: false, loading: true, prediction: "No prediction attempted" };

    async componentDidMount() {
        console.log("Tf ready state:", this.state.isTfReady);
        
        const model = await tf.loadLayersModel('model/model.json');
        await tf.ready();
        this.setState({
            isTfReady: true,
            loading: false,
            model: model
        });

        console.log("Tf ready state:", this.state.isTfReady);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        
        const cyl = e.target.cyl.value;
        const disp = e.target.disp.value;
        const hp = e.target.hp.value;
        const weight = e.target.weight.value;
        const accel = e.target.accel.value;
        const year = e.target.year.value;
        const country = e.target.country.value;

        // normalization data (from training data set)

        const norm_mean = {
            "Cylinders": 5.477707,
            "Displacement": 195.318471,
            "Horsepower": 104.869427,
            "Weight": 2990.251592,
            "Acceleration": 15.559236,
            "Model Year": 75.898089,
            "Europe": 0.178344,
            "Japan": 0.197452,
            "USA": 0.624204
        }

        const norm_std = {
            "Cylinders": 1.699788,
            "Displacement": 104.331589,
            "Horsepower": 38.096214,
            "Weight": 843.898596,
            "Acceleration": 2.789230,
            "Model Year": 3.675642,
            "Europe": 0.383413,
            "Japan": 0.398712,
            "USA": 0.485101
        }

        var norm = x => { return (x - norm_mean) / norm_std; }

        // load in user-supplied data

        const data = { 
            "Cylinders": parseInt(cyl), 
            "Displacement": parseInt(disp), 
            "Horsepower": parseInt(hp), 
            "Weight": parseInt(weight), 
            "Acceleration": parseInt(accel), 
            "Model Year": parseInt(year),
            "USA": (country === "1") ? 1 : 0,
            "Europe": (country === "2") ? 1 : 0,
            "Japan": (country === "3") ? 1 : 0
        }

        console.log(data);
        console.log(norm(data));

        // prepare data into a "tensor"
        // then run prediction

        const tensor = tf.tensor2d([[], [cyl, disp, hp, weight, accel, year, data["USA"], data["Europe"], data["Japan"]]]);
        const prediction = this.state.model.predict(tensor);

        // send output to log
        console.log(prediction);
    }

    // We need:
    // Cylinders, Displacement, Horsepower, Weight
    // Acceleration, Model Year, and Country

    render() {
        const { classes } = this.props;
        const { loading, prediction } = this.state;

        return (
            <React.Fragment>
                <CssBaseline />
                <AppBar position="absolute" color="default" className={classes.appBar}>
                    <Toolbar>
                        <AvatarGroup>
                            <Avatar alt="Jupyter" src="jupyter.png" />
                            <Avatar alt="TF" src="tf.png" />
                            <Avatar alt="React" src="react.png" />
                        </AvatarGroup>
                        <Typography variant="h6" color="inherit" noWrap>
                            From Notebook to Browser: Car MPG Demo
                        </Typography>
                    </Toolbar>
                </AppBar>

                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h4" align="center">
                            Predict Car MPG
                        </Typography>

                        <form onSubmit={this.handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField required id="cyl" label="Cylinders" defaultValue="6" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField required id="disp" label="Displacement" defaultValue="152" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField required id="hp" label="Horsepower" defaultValue="184" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField required id="weight" label="Curb Weight" defaultValue="2932" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField required id="accel" label="Acceleration (0 to 60mph)" defaultValue="6.5" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField required id="year" label="Model Year" defaultValue="93" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField required id="country" label="Country" defaultValue="2" />
                                </Grid>
                            </Grid>

                            <React.Fragment>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            disabled={loading}
                                            type="submit"
                                        >
                                            {loading ? "Loading model..." : "Predict MPG"}
                                        </Button>
                                        {loading && <CircularProgress size={14} className={classes.buttonProgress} />}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography component="h4" variant="h6" align="inherit">
                                            {prediction}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </React.Fragment>
                        </form>
                    </Paper>
                    <Copyright />
                </main>
            </React.Fragment>
        );
    }
}

export default withStyles(styles, { withTheme: true })(App);