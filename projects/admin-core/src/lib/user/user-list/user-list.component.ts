import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserModel } from '@tailormap-admin/admin-api';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { UserDetailsService } from '../services/user-details.service';

@Component({
  selector: 'tm-admin-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {

  public filteredUsers$: Observable<Array<UserModel & { selected: boolean }>>;
  public userFilter: FormControl;
  public filterString$: Observable<string>;

  constructor(
    private userDetailsService: UserDetailsService,
  ) {
    this.userFilter = new FormControl('');
    this.filterString$ = this.userFilter.valueChanges.pipe(startWith(''));

    this.filteredUsers$ = combineLatest([
      this.userDetailsService.getUsers$(),
      this.filterString$,
      this.userDetailsService.selectedUser$,
    ]).pipe(
      map(([ users, filterString, selectedUser ]) => {
        return users
          .filter(user => user.username.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)
          .map(user => ({
            ...user,
            selected: !!(selectedUser && user.username === selectedUser.username),
          }));
      }),
    );
  }

}