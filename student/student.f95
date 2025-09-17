program grading
implicit none
integer :: score


do
print*, 'Please input your score'
read*, score

if(score == -1) then
print*, 'Exiting now'
exit

else if ( score >= 0 .and. score< 50 ) then
print*, 'F'

        `   `z
else if ( score  >= 50 .and. score< 59 ) then
print*, 'D'


else if ( score >= 60 .and. score< 69  ) then
print*, 'C'


else if ( score >= 70 .and. score<79  ) then
print*, 'B' 


else if ( score >= 80 .and. score< 100  ) then
print*, 'A' 

else
print*, 'Please enter a score between 0 and 100'
end if
end do

end program grading