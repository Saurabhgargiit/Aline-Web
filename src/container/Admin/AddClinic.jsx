const AddClinic = () => {
    return (
        <div>
            <div>
                <label htmlFor='clinic-name'>Clinic Name</label>
                <input id='clinic-name' type='text'></input>
            </div>
            <div>
                <label htmlFor='clinic-address'>Address</label>
                <input id='clinic-address' type='text'></input>
            </div>
            <div>
                <label htmlFor='clinic-city'>City</label>
                <input id='clinic-city' type='text'></input>
            </div>
            <div>
                <label htmlFor='clinic-mobile'>Phone No.</label>
                <input id='clinic-mobile' type='number'></input>
            </div>
            <div>
                <label htmlFor='clinic-role'>role</label>
                <input id='clinic-role' type='dropdown' disabled value={'Clinic'}></input>
            </div>
            <div>
                <label htmlFor='clinic-email'>Email</label>
                <input id='clinic-email' type='email'></input>
            </div>
            <div>
                <label htmlFor='clinic-pass'>Password</label>
                <input id='clinic-pass' type='password'></input>
            </div>
        </div>
    );
};

export default AddClinic;
