Get-ChildItem -File | ForEach-Object {
    $newName = $_.Name -replace '_\d+_11zon', ''
    if ($newName -ne $_.Name) {
        Rename-Item -Path $_.FullName -NewName $newName
    }
}
