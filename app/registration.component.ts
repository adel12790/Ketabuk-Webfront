import { Component, Input } from '@angular/core';
import { User } from './user';
import { Journal } from './journal';
import { RegistrationService, RegistrationForm } from './registration.service'
import { SuperAuth } from './super-auth';

@Component(
    {
        selector: 'my-login',
        templateUrl: 'app/registration.component.html',
        providers: [RegistrationService]
    }
)
export class RegistrationComponent// implements OnInit
{
    @Input() form : RegistrationForm;
    @Input() journalModified: boolean;
    @Input() journalName: string;
    @Input() password: string;
    @Input() valid: boolean = false;
    response: string;
    errorMessage: any;
    submitted: boolean = false;

    constructor(private registerationService: RegistrationService)
    {
        this.form = new RegistrationForm;
        this.form.user = new User;
        this.form.user.journal = new Journal;
        this.journalModified = false;
        this.form.user.journal.name = '';
    }

    // ngOnInit()
    // {
        
    // }

    setJournalModified($event)
    {
        this.journalModified = true;
    }

    setJournalName($event)
    {
        this.form.user.journal.name = "كـتـاب " + this.form.user.name;
    }

    comparePasswords()
    {
        if (this.form.password == this.password) { this.valid = true; return }
        this.valid = false;
    }

    register()
    {
        if(this.valid)
        {
            this.registerationService.register(this.form)
                .subscribe(
                response => SuperAuth.login(response),
                error =>  this.errorMessage = <any>error);
            
            
        }
        this.submitted = true;
    }
}